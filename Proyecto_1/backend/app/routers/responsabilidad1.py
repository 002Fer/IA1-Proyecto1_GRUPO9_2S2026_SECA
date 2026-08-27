from fastapi import APIRouter, HTTPException
from app.prolog_service import PrologService

router = APIRouter(
    prefix="/api/resp1",
    tags=["Acceso, oportunidad y backend (Resp 1)"]
)

prolog_service = PrologService()


def validar_caso(case_id: str):
    caso = prolog_service.query_once(
        f"caso({prolog_service.q(case_id)},Titulo,Descripcion,Dificultad)"
    )

    if not caso:
        raise HTTPException(status_code=404, detail="Caso no encontrado")


def convertir_booleano(valor):
    valor = prolog_service.value(valor)

    if isinstance(valor, bool):
        return valor

    return str(valor).lower() == "true"


@router.get("/cases/{case_id}/suspects")
def obtener_sospechosos(case_id: str):
    validar_caso(case_id)

    return [
        {
            "suspectId": prolog_service.value(row["Persona"]),
            "suspectName": prolog_service.value(row["Nombre"]),
        }
        for row in prolog_service.query_all(
            f"persona({prolog_service.q(case_id)},Persona,Nombre,sospechoso)"
        )
    ]


@router.get("/cases/{case_id}/places")
def obtener_lugares(case_id: str):
    validar_caso(case_id)

    lugares = []

    for row in prolog_service.query_all(
        f"lugar({prolog_service.q(case_id)},Id,Descripcion)"
    ):
        descripcion = prolog_service.value(row["Descripcion"])
        partes = descripcion.split(": ", 1)

        lugares.append(
            {
                "placeId": prolog_service.value(row["Id"]),
                "name": partes[0],
                "description": partes[1] if len(partes) > 1 else descripcion,
            }
        )

    return lugares


@router.get("/cases/{case_id}/timeline")
def obtener_linea_tiempo(case_id: str):
    validar_caso(case_id)

    return [
        {
            "time": prolog_service.value(row["Hora"]),
            "event": prolog_service.value(row["Evento"]),
            "suspicious": convertir_booleano(row["Sospechoso"]),
        }
        for row in prolog_service.query_all(
            f"linea_tiempo({prolog_service.q(case_id)},Hora,Evento,Sospechoso)"
        )
    ]


@router.get("/cases/{case_id}/access")
def obtener_accesos_inferidos(case_id: str):
    validar_caso(case_id)

    resultados = []

    for row in prolog_service.query_all(
        f"tuvo_acceso(Persona,{prolog_service.q(case_id)})"
    ):
        persona = prolog_service.value(row["Persona"])

        registros = prolog_service.query_all(
            "registro_acceso("
            f"{prolog_service.q(case_id)},"
            f"{prolog_service.q(persona)},"
            "Lugar,Hora,Fuente,Accion),"
            f"ubicacion_incidente({prolog_service.q(case_id)},Lugar)"
        )

        resultados.append(
            {
                "suspectId": persona,
                "suspectName": prolog_service.person_name(case_id, persona),
                "accessRecords": [
                    {
                        "location": prolog_service.value(registro["Lugar"]),
                        "time": prolog_service.value(registro["Hora"]),
                        "source": prolog_service.value(registro["Fuente"]),
                        "action": prolog_service.value(registro["Accion"]),
                    }
                    for registro in registros
                ],
            }
        )

    return resultados


@router.get("/cases/{case_id}/opportunities")
def obtener_oportunidades(case_id: str):
    validar_caso(case_id)

    resultados = []

    for row in prolog_service.query_all(
        f"tuvo_oportunidad(Persona,{prolog_service.q(case_id)})"
    ):
        persona = prolog_service.value(row["Persona"])

        registros = prolog_service.query_all(
            "registro_acceso("
            f"{prolog_service.q(case_id)},"
            f"{prolog_service.q(persona)},"
            "Lugar,Hora,Fuente,Accion),"
            f"ubicacion_incidente({prolog_service.q(case_id)},Lugar),"
            f"horario_incidente({prolog_service.q(case_id)},Inicio,Fin),"
            "hora_en_intervalo(Hora,Inicio,Fin)"
        )

        resultados.append(
            {
                "suspectId": persona,
                "suspectName": prolog_service.person_name(case_id, persona),
                "opportunityRecords": [
                    {
                        "location": prolog_service.value(registro["Lugar"]),
                        "time": prolog_service.value(registro["Hora"]),
                        "incidentStart": prolog_service.value(registro["Inicio"]),
                        "incidentEnd": prolog_service.value(registro["Fin"]),
                        "source": prolog_service.value(registro["Fuente"]),
                        "action": prolog_service.value(registro["Accion"]),
                    }
                    for registro in registros
                ],
            }
        )

    return resultados