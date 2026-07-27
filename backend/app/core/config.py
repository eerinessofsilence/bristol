from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ClearGateCustoms API"
    app_env: str = "development"
    database_url: str = (
        "postgresql+psycopg://cleargatecustoms:cleargatecustoms@localhost:5432/cleargatecustoms"
    )
    cors_origins: str = "http://localhost:5173"
    nbu_exchange_rate_url: str = (
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json"
    )
    nbu_eur_exchange_rate_url: str = (
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=EUR&json"
    )
    nbu_timeout_seconds: float = 5.0
    nbu_cache_ttl_hours: int = 12
    openai_api_key: str = ""
    openai_model: str = "gpt-5.6"
    openai_timeout_seconds: float = 45.0
    product_code_ai_requests_per_minute: int = 5
    product_code_ai_max_concurrent: int = 2
    email_notifications_enabled: bool = False
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    smtp_from_email: str = ""
    lead_notification_email: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
