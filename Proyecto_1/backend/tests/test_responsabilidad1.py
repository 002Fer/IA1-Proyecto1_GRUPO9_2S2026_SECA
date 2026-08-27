from fastapi.testclient import TestClient
from app.prolog_service import PrologService
from main import app

client = TestClient(app)
prolog_service = PrologService()


def obtener_personas(consulta):
    return {
        prolog_service.value(resultado["Persona"])
        for resultado in prolog_service.query_all(consulta)
    }


def test_prolog_acceso_caso1():
    personas = obtener_personas(
        "tuvo_acceso(Persona,'caso-1')"
    )

    assert personas == {"suspect-2"}


def test_prolog_acceso_caso2():
    personas = obtener_personas(
        "tuvo_acceso(Persona,'caso-2')"
    )

    assert personas == {"suspect-b3", "suspect-b4"}


def test_prolog_oportunidad_caso2():
    personas = obtener_personas(
        "tuvo_oportunidad(Persona,'caso-2')"
    )

    assert personas == {"suspect-b3"}


def test_prolog_acceso_sin_oportunidad():
    acceso = prolog_service.query_all(
        "tuvo_acceso('suspect-b4','caso-2')"
    )

    oportunidad = prolog_service.query_all(
        "tuvo_oportunidad('suspect-b4','caso-2')"
    )

    assert len(acceso) == 1
    assert oportunidad == []


def test_api_sospechosos_caso1():
    response = client.get(
        "/api/resp1/cases/caso-1/suspects"
    )

    assert response.status_code == 200

    datos = response.json()

    assert len(datos) == 4
    assert any(
        sospechoso["suspectId"] == "suspect-2"
        for sospechoso in datos
    )


def test_api_lugares_caso1():
    response = client.get(
        "/api/resp1/cases/caso-1/places"
    )

    assert response.status_code == 200

    datos = response.json()

    assert len(datos) == 5
    assert any(
        lugar["name"] == "Sala 3 - Galeria Principal"
        for lugar in datos
    )


def test_api_linea_tiempo_caso1():
    response = client.get(
        "/api/resp1/cases/caso-1/timeline"
    )

    assert response.status_code == 200

    datos = response.json()

    assert len(datos) == 10
    assert all(
        isinstance(evento["suspicious"], bool)
        for evento in datos
    )


def test_api_accesos_caso2():
    response = client.get(
        "/api/resp1/cases/caso-2/access"
    )

    assert response.status_code == 200

    datos = response.json()
    ids = {
        sospechoso["suspectId"]
        for sospechoso in datos
    }

    assert ids == {"suspect-b3", "suspect-b4"}


def test_api_oportunidades_caso2():
    response = client.get(
        "/api/resp1/cases/caso-2/opportunities"
    )

    assert response.status_code == 200

    datos = response.json()

    assert len(datos) == 1
    assert datos[0]["suspectId"] == "suspect-b3"
    assert datos[0]["opportunityRecords"]


def test_api_caso_inexistente():
    response = client.get(
        "/api/resp1/cases/caso-99/suspects"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Caso no encontrado"