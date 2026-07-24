from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Bristol API"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://portway:portway@localhost:5432/portway"
    cors_origins: str = "http://localhost:5173"
    nbu_exchange_rate_url: str = (
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json"
    )
    nbu_timeout_seconds: float = 5.0
    nbu_cache_ttl_hours: int = 12

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
