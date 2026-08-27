import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "online"
    assert "Responsabilidad 4" in json_data["modulo_activo"]

def test_endpoint_declaraciones_positivo():
    response = client.get("/api/casos/caso-1/declaraciones")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["caso_id"] == "caso-1"
    assert json_data["total"] > 0

def test_endpoint_contradicciones_positivo():
    response = client.get("/api/casos/caso-1/contradicciones")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["total_contradicciones"] > 0
    contradicciones = json_data["contradicciones"]
    assert any(c["Persona"] == "suspect-2" for c in contradicciones)

def test_endpoint_informacion_falsa_positivo():
    response = client.get("/api/casos/caso-1/informacion-falsa")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["total"] > 0

def test_endpoint_complices_positivo():
    response = client.get("/api/casos/caso-1/complices?sospechoso_principal=suspect-2")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["total_complices"] > 0
    complices = json_data["complices"]
    assert any(c["Complice"] == "suspect-4" for c in complices)

def test_endpoint_contradicciones_caso_negativo():
    response = client.get("/api/casos/caso-inexistente/contradicciones")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["total_contradicciones"] == 0
    assert len(json_data["contradicciones"]) == 0
