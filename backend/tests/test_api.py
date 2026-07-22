from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
Base.metadata.create_all(bind=engine)


def override_get_db():
    database = TestingSession()
    try:
        yield database
    finally:
        database.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_quote_calculation() -> None:
    response = client.post(
        "/api/v1/quotes/calculate",
        json={"customs_value": 1000, "currency_rate": 41.5, "duty_rate": 5},
    )
    assert response.status_code == 200
    assert response.json()["total"] == 10790


def test_lead_creation() -> None:
    response = client.post(
        "/api/v1/leads",
        json={
            "first_name": "Олена",
            "last_name": "Коваль",
            "phone": "+380501234567",
            "email": "olena@example.com",
            "source": "test",
        },
    )
    assert response.status_code == 201
    assert response.json()["message"] == "Заявку прийнято"
