from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.prolog_service import PrologService

router = APIRouter(
    prefix="/api/casos",
    tags=["Contradicciones y Declaraciones (Resp 4)"]
)

prolog_service = PrologService()

@router.get("/{caso_id}/declaraciones", summary="Obtener declaraciones de sospechosos")
def obtener_declaraciones(caso_id: str, persona_id: Optional[str] = Query(None, description="ID del sospechoso")):
    """
    Retorna las declaraciones registradas para un caso especifico.
    Permite filtrar opcionalmente por sospechoso.
    """
    declaraciones = prolog_service.get_declaraciones(caso_id, persona_id)
    return {
        "caso_id": caso_id,
        "persona_id": persona_id,
        "total": len(declaraciones),
        "declaraciones": declaraciones
    }

@router.get("/{caso_id}/contradicciones", summary="Detectar contradicciones entre declaraciones y evidencias")
def obtener_contradicciones(caso_id: str):
    """
    Ejecuta inferencia lógica en Prolog para detectar si las declaraciones
    de los sospechosos contradicen evidencias físicas, registros digitales o cámaras.
    """
    contradicciones = prolog_service.get_contradicciones_evidencia(caso_id)
    return {
        "caso_id": caso_id,
        "total_contradicciones": len(contradicciones),
        "contradicciones": contradicciones
    }

@router.get("/{caso_id}/informacion-falsa", summary="Detectar sospechosos que proporcionaron información falsa")
def obtener_informacion_falsa(caso_id: str):
    """
    Identifica qué sospechosos proporcionaron testimonio falso según la inferencia de Prolog.
    """
    falsedades = prolog_service.get_informacion_falsa(caso_id)
    return {
        "caso_id": caso_id,
        "total": len(falsedades),
        "sospechosos_con_informacion_falsa": falsedades
    }

@router.get("/{caso_id}/complices", summary="Inferir posibles cómplices del delito")
def obtener_complices(caso_id: str, sospechoso_principal: Optional[str] = Query(None, description="ID del sospechoso principal")):
    """
    Aplica reglas de inferencia para determinar posibles cómplices basándose en
    relaciones previas y evidencias/contradicciones compartidas.
    """
    complices = prolog_service.get_complices(caso_id, sospechoso_principal)
    return {
        "caso_id": caso_id,
        "sospechoso_principal": sospechoso_principal,
        "total_complices": len(complices),
        "complices": complices
    }
