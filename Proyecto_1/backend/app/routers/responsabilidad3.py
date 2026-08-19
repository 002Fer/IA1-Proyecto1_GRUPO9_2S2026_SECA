from fastapi import APIRouter, HTTPException, Query
from app.prolog_service import PrologService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api",
    tags=[" Coartadas e interfaz de investigación (Resp 3)"]
)

prolog_service = PrologService()

class ActionLog(BaseModel):
    caseId: str = "sin-caso"
    action: str

@router.get("/cases")
def get_cases():
    return prolog_service.all_cases()


@router.get("/cases/{case_id}")
def get_case(case_id: str):
    payload = prolog_service.case_payload(case_id)
    if not payload:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    return payload


@router.get("/cases/{case_id}/alibis")
def get_alibis(case_id: str):
    return [
        {
            "suspectId": prolog_service.value(row["Persona"]),
            "suspectName": prolog_service.person_name(case_id, prolog_service.value(row["Persona"])),
            "status": prolog_service.value(row["Estado"]),
            "text": prolog_service.value(row["Texto"]),
        }
        for row in prolog_service.query_all(f"resumen_coartada({prolog_service.q(case_id)},Persona,Estado,Texto)")
    ]


@router.get("/cases/{case_id}/witnesses")
def get_witnesses(case_id: str):
    return [
        {
            "id": prolog_service.value(row["Id"]),
            "name": prolog_service.value(row["Nombre"]),
            "observation": prolog_service.value(row["Observacion"]),
            "suspectId": prolog_service.value(row["Persona"]),
            "suspectName": prolog_service.person_name(case_id, prolog_service.value(row["Persona"])),
        }
        for row in prolog_service.query_all(f"testigo({prolog_service.q(case_id)},Id,Nombre,Observacion,Persona)")
    ]


@router.get("/cases/{case_id}/cameras")
def get_cameras(case_id: str):
    return [
        {
            "id": prolog_service.value(row["Id"]),
            "location": prolog_service.value(row["Lugar"]),
            "start": prolog_service.value(row["Inicio"]),
            "end": prolog_service.value(row["Fin"]),
            "observation": prolog_service.value(row["Observacion"]),
        }
        for row in prolog_service.query_all(f"camara({prolog_service.q(case_id)},Id,Lugar,Inicio,Fin,Observacion)")
    ]


@router.get("/cases/{case_id}/access")
def get_access(case_id: str):
    return [
        {
            "suspectId": prolog_service.value(row["Persona"]),
            "suspectName": prolog_service.person_name(case_id, prolog_service.value(row["Persona"])),
            "location": prolog_service.value(row["Lugar"]),
            "time": prolog_service.value(row["Hora"]),
            "source": prolog_service.value(row["Fuente"]),
            "action": prolog_service.value(row["Accion"]),
        }
        for row in prolog_service.query_all(f"registro_acceso({prolog_service.q(case_id)},Persona,Lugar,Hora,Fuente,Accion)")
    ]


@router.get("/cases/{case_id}/testimonies")
def get_testimonies(case_id: str):
    return [
        {
            "suspectId": prolog_service.value(row["Persona"]),
            "suspectName": prolog_service.person_name(case_id, prolog_service.value(row["Persona"])),
            "statement": prolog_service.value(row["Declaracion"]),
            "type": prolog_service.value(row["Tipo"]),
        }
        for row in prolog_service.query_all(f"testimonio({prolog_service.q(case_id)},Persona,Declaracion,Tipo)")
    ]


@router.get("/cases/{case_id}/clues")
def get_clues(case_id: str):
    return [
        {"time": prolog_service.value(row["Hora"]), "clue": prolog_service.value(row["Evento"])}
        for row in prolog_service.query_all(f"linea_tiempo({prolog_service.q(case_id)},Hora,Evento,true)")
    ]


@router.get("/cases/{case_id}/explanation/{suspect_id}")
def get_explanation(case_id: str, suspect_id: str):
    row = prolog_service.query_once(f"explicacion_acusacion({prolog_service.q(case_id)},{prolog_service.q(suspect_id)},Reglas)")
    return {"rules": [prolog_service.value(x) for x in row["Reglas"]] if row else []}


@router.post("/cases/{case_id}/accuse")
def accuse(case_id: str, payload: dict):
    suspect_id = payload.get("suspectId")
    if not suspect_id:
        raise HTTPException(status_code=400, detail="Debe indicar el sospechoso acusado")

    row = prolog_service.query_once(
        f"acusacion_final({prolog_service.q(case_id)},{prolog_service.q(suspect_id)},Resultado,Reglas)"
    )
    culprit = prolog_service.query_once(f"responsable_logico({prolog_service.q(case_id)},Culpable)")
    if not row or not culprit:
        raise HTTPException(
            status_code=422,
            detail="No fue posible resolver la acusación con las reglas lógicas",
        )

    result = prolog_service.value(row["Resultado"])
    culprit_id = prolog_service.value(culprit["Culpable"])
    return {
        "correct": result == "correcta",
        "accused": suspect_id,
        "accusedName": prolog_service.person_name(case_id, suspect_id),
        "culprit": culprit_id,
        "culpritName": prolog_service.person_name(case_id, culprit_id),
        "message": (
            "Felicitaciones. Has resuelto el caso correctamente."
            if result == "correcta"
            else f"Incorrecto. El responsable lógico era {prolog_service.person_name(case_id, culprit_id)}."
        ),
        "rules": [prolog_service.value(x) for x in row["Reglas"]],
    }


@router.post("/log")
def log_action(payload: ActionLog):
    timestamp = datetime.now().isoformat(timespec="seconds")
    prolog_service.query_all(f"bitacora({prolog_service.q(payload.caseId)},{prolog_service.q(payload.action)},{prolog_service.q(timestamp)})")
    return {
        "ok": True,
        "caseId": payload.caseId,
        "action": payload.action,
        "timestamp": timestamp,
    }


@router.get("/log/{case_id}")
def get_log(case_id: str):
    return [
        {"action": prolog_service.value(row["Accion"]), "timestamp": prolog_service.value(row["Marca"])}
        for row in prolog_service.query_all(f"accion_bitacora({prolog_service.q(case_id)},Accion,Marca)")
    ]
