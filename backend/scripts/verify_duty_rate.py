#!/usr/bin/env python3
"""Compare one local duty rate with QDPro without affecting runtime."""

import argparse
import json
import re
from html import unescape
from pathlib import Path

import httpx

RATE_PATTERN = re.compile(
    r"Пільгова\s+ставка\s*</td>\s*<td[^>]*>\s*(?:<[^>]+>\s*)*"
    r"(\d+(?:[.,]\d+)?)\s*%",
    re.IGNORECASE,
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("product_code", help="10-значний код УКТ ЗЕД")
    args = parser.parse_args()
    if not re.fullmatch(r"\d{10}", args.product_code):
        parser.error("product_code має містити 10 цифр")

    data_path = Path(__file__).resolve().parents[1] / "app" / "data" / "duty_rates.json"
    data = json.loads(data_path.read_text(encoding="utf-8"))
    local = data["rates"].get(args.product_code)
    if local is None:
        raise SystemExit(
            f"{args.product_code}: немає у локальному довіднику"
        )

    url = f"https://qdpro.com.ua/uk/goodinfo/{args.product_code}"
    response = httpx.get(
        url,
        follow_redirects=True,
        timeout=15,
        headers={"User-Agent": "ClearGateCustoms duty-rate verifier"},
    )
    response.raise_for_status()
    match = RATE_PATTERN.search(unescape(response.text).replace("\xa0", " "))
    if match is None:
        raise SystemExit("QDPro: не вдалося знайти пільгову ставку")

    qdpro_rate = float(match.group(1).replace(",", "."))
    local_rate = float(local["preferentialPercent"])
    print(f"Локально: {local_rate:g}%")
    print(f"QDPro:    {qdpro_rate:g}% — {url}")
    print("Держмитслужба: https://cabinet.customs.gov.ua/tnvinfo")
    if local_rate != qdpro_rate:
        raise SystemExit("ПОМИЛКА: ставки не збігаються")
    print("OK: ставки збігаються")


if __name__ == "__main__":
    main()
