import asyncio
import math
import time
from collections import deque
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Callable


class ProductCodeRateLimitError(RuntimeError):
    def __init__(self, retry_after_seconds: int) -> None:
        super().__init__("Product-code AI request rate exceeded")
        self.retry_after_seconds = retry_after_seconds


class ProductCodeCapacityError(RuntimeError):
    pass


class ProductCodeRequestGuard:
    def __init__(
        self,
        *,
        requests_per_window: int,
        window_seconds: float,
        max_concurrent: int,
        clock: Callable[[], float] = time.monotonic,
    ) -> None:
        if requests_per_window < 1 or window_seconds <= 0 or max_concurrent < 1:
            raise ValueError("Product-code request limits must be positive")

        self.requests_per_window = requests_per_window
        self.window_seconds = window_seconds
        self.max_concurrent = max_concurrent
        self._clock = clock
        self._requests: dict[str, deque[float]] = {}
        self._active_requests = 0
        self._lock = asyncio.Lock()

    @asynccontextmanager
    async def permit(self, client_key: str) -> AsyncIterator[None]:
        await self._acquire(client_key)
        try:
            yield
        finally:
            async with self._lock:
                self._active_requests -= 1

    async def _acquire(self, client_key: str) -> None:
        now = self._clock()
        cutoff = now - self.window_seconds

        async with self._lock:
            if self._active_requests >= self.max_concurrent:
                raise ProductCodeCapacityError

            requests = self._requests.setdefault(client_key, deque())
            while requests and requests[0] <= cutoff:
                requests.popleft()

            if len(requests) >= self.requests_per_window:
                retry_after = max(1, math.ceil(requests[0] + self.window_seconds - now))
                raise ProductCodeRateLimitError(retry_after)

            requests.append(now)
            self._active_requests += 1
            self._remove_expired_clients(cutoff)

    def _remove_expired_clients(self, cutoff: float) -> None:
        if len(self._requests) < 1024:
            return

        expired_clients = [
            client_key
            for client_key, requests in self._requests.items()
            if not requests or requests[-1] <= cutoff
        ]
        for client_key in expired_clients:
            self._requests.pop(client_key, None)

    def reset(self) -> None:
        """Clear request history when no requests are running, primarily for tests."""
        self._requests.clear()
        self._active_requests = 0
