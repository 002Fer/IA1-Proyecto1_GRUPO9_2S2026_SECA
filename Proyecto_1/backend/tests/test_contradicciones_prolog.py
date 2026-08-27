import pytest
from app.prolog_service import PrologService

@pytest.fixture
def prolog_service():
    return PrologService()

# =========================================================================
# PRUEBAS POSITIVAS (Casos donde existen contradicciones y cómplices reales)
# =========================================================================

def test_contradiccion_evidencia_positiva_caso1(prolog_service):
    """
    PRUEBA POSITIVA: En Caso 1, Elena Rios (suspect-2) afirma haber estado en su taller toda la noche,
    pero la cámara exterior la ubica a las 21:30 en el museo.
    """
    res = prolog_service.get_contradicciones_evidencia('caso-1')
    assert len(res) > 0
    sospechosos_contradichos = [item['Persona'] for item in res]
    assert 'suspect-2' in sospechosos_contradichos

def test_informacion_falsa_positiva_caso1(prolog_service):
    """
    PRUEBA POSITIVA: Carmen Lozano (suspect-4) afirma estar enferma en su casa,
    pero el recibo la ubica en la farmacia cercana a las 22:00.
    """
    res = prolog_service.get_informacion_falsa('caso-1')
    assert len(res) > 0
    personas_falsas = [item['Persona'] for item in res]
    assert 'suspect-4' in personas_falsas

def test_complice_positivo_caso1(prolog_service):
    """
    PRUEBA POSITIVA: En Caso 1, Carmen Lozano es inferida como cómplice de Elena Rios
    debido a su relación previa en el mercado negro y sus contradicciones.
    """
    res = prolog_service.get_complices('caso-1', sospechoso_principal='suspect-2')
    assert len(res) > 0
    complices = [c['Complice'] for c in res]
    assert 'suspect-4' in complices

def test_contradiccion_evidencia_positiva_caso2(prolog_service):
    """
    PRUEBA POSITIVA: En Caso 2, Viktor Sorokin (suspect-b3) afirma estar en casa,
    pero las cámaras del aparcamiento lo registran en el edificio a las 22:15.
    """
    res = prolog_service.get_contradicciones_evidencia('caso-2')
    assert len(res) > 0
    personas = [item['Persona'] for item in res]
    assert 'suspect-b3' in personas


# =========================================================================
# PRUEBAS NEGATIVAS (Casos donde NO deben haber falsos positivos)
# =========================================================================

def test_coartada_limpia_sin_contradiccion_caso1(prolog_service):
    """
    PRUEBA NEGATIVA: Marco Villanueva (suspect-1) tiene una coartada comprobada en la cena.
    No debe figurar como sospechoso que dio información falsa por contradicción de ubicación.
    """
    res = prolog_service.get_contradicciones_evidencia('caso-1')
    personas = [item['Persona'] for item in res]
    assert 'suspect-1' not in personas

def test_caso_inexistente_sin_resultados(prolog_service):
    """
    PRUEBA NEGATIVA: Consultar un id de caso no registrado debe retornar una lista vacía
    sin lanzar excepciones ni retornar datos erróneos.
    """
    res = prolog_service.get_contradicciones_evidencia('caso-invalido-999')
    assert isinstance(res, list)
    assert len(res) == 0

def test_complice_inexistente_retorna_vacio(prolog_service):
    """
    PRUEBA NEGATIVA: Buscar cómplice para un sospechoso sin cómplices debe retornar vacío.
    """
    res = prolog_service.get_complices('caso-1', sospechoso_principal='suspect-3')
    assert isinstance(res, list)
    assert len(res) == 0
