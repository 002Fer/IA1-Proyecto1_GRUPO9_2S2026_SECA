from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.prolog_service import PrologService

router = APIRouter(
    prefix="/api/admin",
    tags=["Módulo Administrativo (Resp 2)"]
)

prolog_service = PrologService()

class SuspectItem(BaseModel):
    id: Optional[str] = None
    name: str
    role: Optional[str] = "Sospechoso"
    alibi: Optional[str] = "Estuve en casa durante la noche"
    motive: Optional[str] = "ninguno"
    means: Optional[str] = "ninguno"

class EvidenceItem(BaseModel):
    id: Optional[str] = None
    type: str = "fisica"
    description: str
    place: str = "Lugar del incidente"

class PlaceItem(BaseModel):
    id: Optional[str] = None
    name: str
    description: str = ""

class CaseCreate(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    difficulty: str = "Facil"
    suspects: Optional[List[SuspectItem]] = []
    evidence: Optional[List[EvidenceItem]] = []
    places: Optional[List[PlaceItem]] = []

class CaseUpdate(BaseModel):
    title: str
    description: str
    difficulty: str = "Facil"

class SuspectCreate(BaseModel):
    id: str
    name: str
    type: str = "sospechoso"

class EvidenceCreate(BaseModel):
    id: str
    type: str
    description: str
    place: str

class StatementCreate(BaseModel):
    id: str
    personId: str
    text: str
    type: str = "declaracion_sospechoso"


def normalizar_dificultad(dif: str) -> str:
    dif_lower = dif.lower().strip()
    if "facil" in dif_lower or "fácil" in dif_lower:
        return "facil"
    if "medio" in dif_lower or "media" in dif_lower:
        return "medio"
    if "dificil" in dif_lower or "difícil" in dif_lower:
        return "dificil"
    return "facil"


# -----------------------------------------------------------------------------
# CASOS
# -----------------------------------------------------------------------------

@router.get("/cases")
def list_admin_cases():
    return prolog_service.all_cases()


@router.post("/cases")
def create_case(case: CaseCreate):
    case_id = case.id or f"caso-{abs(hash(case.title + str(len(prolog_service.all_cases())))) % 10000}"
    dif_pl = normalizar_dificultad(case.difficulty)
    
    # Verificar si ya existe
    existente = prolog_service.query_once(f"caso({prolog_service.q(case_id)},_,_,_)")
    if existente is not None:
        raise HTTPException(status_code=400, detail=f"El caso con ID '{case_id}' ya existe.")
    
    # 1. Crear caso básico en Prolog
    q = f"crear_caso({prolog_service.q(case_id)}, {prolog_service.q(case.title)}, {prolog_service.q(case.description)}, {dif_pl})"
    prolog_service.query_all(q)
    
    suspect_ids = []
    culprits = []
    
    # 2. Agregar sospechosos con testimonios, coartadas y perfiles completos
    for idx, s in enumerate(case.suspects or []):
        sid = s.id or f"suspect-{case_id}-{idx+1}"
        suspect_ids.append(sid)
        alibi_txt = s.alibi or f"Afirma no haber estado en la escena del crimen."
        has_motive = s.motive and s.motive != "ninguno"
        has_means = s.means and s.means != "ninguno"
        is_culprit_profile = has_motive and has_means
        
        if is_culprit_profile:
            culprits.append(sid)
        
        # Hechos en Prolog (persona/4 y perfil/5)
        prolog_service.query_all(
            f"crear_persona({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(s.name)}, sospechoso)"
        )
        prolog_service.query_all(
            f"assertz(perfil({prolog_service.q(case_id)}, {prolog_service.q(sid)}, 35, {prolog_service.q(s.role or 'Sospechoso')}, {prolog_service.q(f'Persona involucrada en la investigación ({s.role}).')}))"
        )
        
        # Testimonio de sospechoso (testimonio/4)
        prolog_service.query_all(
            f"assertz(testimonio({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, declaracion_sospechoso))"
        )
        prolog_service.query_all(
            f"assertz(declaracion({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, '20:00', '23:59', 'fuera_escena'))"
        )
        
        # Coartada (coartada/5): si tiene móvil y medios, su coartada no se sostiene lógicamente
        alibi_valid_flag = "false" if is_culprit_profile else "true"
        prolog_service.query_all(
            f"assertz(coartada({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, {alibi_valid_flag}, coartada_registrada))"
        )
        
        # Motivo estructurado si aplica
        if has_motive:
            prolog_service.query_all(
                f"crear_motivo({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {s.motive})"
            )
        
        # Medios estructurados si aplica
        if has_means:
            prolog_service.query_all(
                f"crear_herramienta({prolog_service.q(case_id)}, {s.means}, acceso)"
            )
            prolog_service.query_all(
                f"asignar_herramienta({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {s.means})"
            )

    # 3. Agregar evidencias y vincularlas lógicamente con los sospechosos
    for idx, e in enumerate(case.evidence or []):
        eid = e.id or f"ev-{case_id}-{idx+1}"
        prolog_service.query_all(
            f"crear_evidencia({prolog_service.q(case_id)}, {prolog_service.q(eid)}, {e.type}, {prolog_service.q(e.description)}, {prolog_service.q(e.place)})"
        )
        # Vincular evidencia con el sospechoso que tiene móvil y medios
        target_suspect = culprits[0] if culprits else (suspect_ids[idx % len(suspect_ids)] if suspect_ids else None)
        if target_suspect:
            prolog_service.query_all(
                f"assertz(evidencia_relacionada({prolog_service.q(case_id)}, {prolog_service.q(eid)}, {prolog_service.q(target_suspect)}))"
            )

    # 4. Generar contradicciones para sospechosos incriminados (contradiccion/4)
    for c_id in culprits:
        prolog_service.query_all(
            f"assertz(contradiccion({prolog_service.q(case_id)}, {prolog_service.q('Afirma no haber estado en el lugar de los hechos')}, {prolog_service.q('Evidencias y registros perimetrales sitúan su presencia en la escena')}, {prolog_service.q(c_id)}))"
        )

    # 5. Agregar lugares, cámaras (camara/6), accesos (registro_acceso/6) y testigos (testigo/5)
    for idx, p in enumerate(case.places or []):
        pid = p.id or f"pl-{case_id}-{idx+1}"
        lugar_desc = f"{p.name}: {p.description}" if p.description else p.name
        prolog_service.query_all(
            f"assertz(lugar({prolog_service.q(case_id)}, {prolog_service.q(pid)}, {prolog_service.q(lugar_desc)}))"
        )
        
        # Cámara de seguridad (camara/6)
        cid = f"cam-{case_id}-{idx+1}"
        prolog_service.query_all(
            f"assertz(camara({prolog_service.q(case_id)}, {prolog_service.q(cid)}, {prolog_service.q(p.name)}, '20:00', '23:59', {prolog_service.q('Grabación perimetral activa')}))"
        )
        
        # Testigo (testigo/5)
        tid = f"testigo-{case_id}-{idx+1}"
        target_s = suspect_ids[idx % len(suspect_ids)] if suspect_ids else "desconocido"
        prolog_service.query_all(
            f"assertz(testigo({prolog_service.q(case_id)}, {prolog_service.q(tid)}, {prolog_service.q(f'Testigo de {p.name}')}, {prolog_service.q(f'Observó movimientos sospechosos cerca de {p.name}')}, {prolog_service.q(target_s)}))"
        )
        
        # Registro de acceso (registro_acceso/6)
        hora = f"2{idx%4}:15"
        prolog_service.query_all(
            f"assertz(registro_acceso({prolog_service.q(case_id)}, {prolog_service.q(target_s)}, {prolog_service.q(p.name)}, {prolog_service.q(hora)}, {prolog_service.q(cid)}, {prolog_service.q('presencia_registrada')}))"
        )

    # 6. Generar línea de tiempo (linea_tiempo/4)
    timeline_events = [
        ("18:00", f"Inicio de operaciones regulares en {case.title}.", "false"),
        ("20:30", "Se registra movimiento inusual y corte intermitente de cámaras.", "true"),
        ("22:15", "Ocurre el incidente principal del caso en el área restringida.", "true"),
        ("23:45", "Se activa la alarma y se descubre la evidencia en la escena.", "true"),
        ("06:00", "Llega el equipo de investigación para analizar los hechos.", "false")
    ]
    for h, ev, susp in timeline_events:
        prolog_service.query_all(
            f"assertz(linea_tiempo({prolog_service.q(case_id)}, {prolog_service.q(h)}, {prolog_service.q(ev)}, {susp}))"
        )

    return {
        "success": True,
        "message": "Caso creado y persistido exitosamente en Prolog con todos sus módulos e indicios lógicos.",
        "case": {
            "id": case_id,
            "title": case.title,
            "description": case.description,
            "difficulty": case.difficulty,
            "suspectsCount": len(case.suspects or []),
            "evidenceCount": len(case.evidence or []),
            "placesCount": len(case.places or [])
        }
    }


class CaseUpdate(BaseModel):
    title: str
    description: str
    difficulty: str = "Facil"
    suspects: Optional[List[SuspectItem]] = None
    evidence: Optional[List[EvidenceItem]] = None
    places: Optional[List[PlaceItem]] = None

@router.put("/cases/{case_id}")
def update_case(case_id: str, case: CaseUpdate):
    existente = prolog_service.query_once(f"caso({prolog_service.q(case_id)},_,_,_)")
    if existente is None:
        raise HTTPException(status_code=404, detail="Caso no encontrado.")
    
    dif_pl = normalizar_dificultad(case.difficulty)
    q = f"actualizar_caso({prolog_service.q(case_id)}, {prolog_service.q(case.title)}, {prolog_service.q(case.description)}, {dif_pl})"
    prolog_service.query_all(q)
    
    # Si se envían sospechosos, evidencias o lugares actualizados
    if case.suspects is not None or case.evidence is not None or case.places is not None:
        # Limpiar hechos asociados del caso
        prolog_service.query_all(f"retractall(persona({prolog_service.q(case_id)},_,_,_))")
        prolog_service.query_all(f"retractall(motivo({prolog_service.q(case_id)},_,_))")
        prolog_service.query_all(f"retractall(herramienta({prolog_service.q(case_id)},_,_))")
        prolog_service.query_all(f"retractall(posee_herramienta({prolog_service.q(case_id)},_,_))")
        prolog_service.query_all(f"retractall(evidencia({prolog_service.q(case_id)},_,_,_,_))")
        prolog_service.query_all(f"retractall(evidencia_relacionada({prolog_service.q(case_id)},_,_))")
        prolog_service.query_all(f"retractall(declaracion({prolog_service.q(case_id)},_,_,_,_))")
        prolog_service.query_all(f"retractall(lugar({prolog_service.q(case_id)},_,_))")
        prolog_service.query_all(f"retractall(coartada({prolog_service.q(case_id)},_,_,_,_))")
        prolog_service.query_all(f"retractall(testimonio({prolog_service.q(case_id)},_,_,_))")
        prolog_service.query_all(f"retractall(contradiccion({prolog_service.q(case_id)},_,_,_))")
        prolog_service.query_all(f"retractall(linea_tiempo({prolog_service.q(case_id)},_,_,_))")
        prolog_service.query_all(f"retractall(testigo({prolog_service.q(case_id)},_,_,_,_))")
        prolog_service.query_all(f"retractall(camara({prolog_service.q(case_id)},_,_,_,_,_))")
        prolog_service.query_all(f"retractall(registro_acceso({prolog_service.q(case_id)},_,_,_,_,_))")
        prolog_service.query_all(f"retractall(perfil({prolog_service.q(case_id)},_,_,_,_))")
        
        suspect_ids = []
        culprits = []
        for idx, s in enumerate(case.suspects or []):
            sid = s.id or f"suspect-{case_id}-{idx+1}"
            suspect_ids.append(sid)
            alibi_txt = s.alibi or f"Afirma no haber estado en la escena del crimen."
            has_motive = s.motive and s.motive != "ninguno"
            has_means = s.means and s.means != "ninguno"
            is_culprit_profile = has_motive and has_means
            if is_culprit_profile:
                culprits.append(sid)
            
            prolog_service.query_all(f"crear_persona({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(s.name)}, sospechoso)")
            prolog_service.query_all(f"assertz(perfil({prolog_service.q(case_id)}, {prolog_service.q(sid)}, 35, {prolog_service.q(s.role or 'Sospechoso')}, {prolog_service.q(f'Persona involucrada en la investigación ({s.role}).')}))")
            prolog_service.query_all(f"assertz(testimonio({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, declaracion_sospechoso))")
            prolog_service.query_all(f"assertz(declaracion({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, '20:00', '23:59', 'fuera_escena'))")
            alibi_valid_flag = "false" if is_culprit_profile else "true"
            prolog_service.query_all(f"assertz(coartada({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {prolog_service.q(alibi_txt)}, {alibi_valid_flag}, coartada_registrada))")
            if has_motive:
                prolog_service.query_all(f"crear_motivo({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {s.motive})")
            if has_means:
                prolog_service.query_all(f"crear_herramienta({prolog_service.q(case_id)}, {s.means}, acceso)")
                prolog_service.query_all(f"asignar_herramienta({prolog_service.q(case_id)}, {prolog_service.q(sid)}, {s.means})")

        for idx, e in enumerate(case.evidence or []):
            eid = e.id or f"ev-{case_id}-{idx+1}"
            prolog_service.query_all(f"crear_evidencia({prolog_service.q(case_id)}, {prolog_service.q(eid)}, {e.type}, {prolog_service.q(e.description)}, {prolog_service.q(e.place)})")
            target_suspect = culprits[0] if culprits else (suspect_ids[idx % len(suspect_ids)] if suspect_ids else None)
            if target_suspect:
                prolog_service.query_all(f"assertz(evidencia_relacionada({prolog_service.q(case_id)}, {prolog_service.q(eid)}, {prolog_service.q(target_suspect)}))")

        for c_id in culprits:
            prolog_service.query_all(f"assertz(contradiccion({prolog_service.q(case_id)}, {prolog_service.q('Afirma no haber estado en el lugar de los hechos')}, {prolog_service.q('Evidencias y registros perimetrales sitúan su presencia en la escena')}, {prolog_service.q(c_id)}))")

        for idx, p in enumerate(case.places or []):
            pid = p.id or f"pl-{case_id}-{idx+1}"
            lugar_desc = f"{p.name}: {p.description}" if p.description else p.name
            prolog_service.query_all(f"assertz(lugar({prolog_service.q(case_id)}, {prolog_service.q(pid)}, {prolog_service.q(lugar_desc)}))")
            cid = f"cam-{case_id}-{idx+1}"
            prolog_service.query_all(f"assertz(camara({prolog_service.q(case_id)}, {prolog_service.q(cid)}, {prolog_service.q(p.name)}, '20:00', '23:59', {prolog_service.q('Grabación perimetral activa')}))")
            tid = f"testigo-{case_id}-{idx+1}"
            target_s = suspect_ids[idx % len(suspect_ids)] if suspect_ids else "desconocido"
            prolog_service.query_all(f"assertz(testigo({prolog_service.q(case_id)}, {prolog_service.q(tid)}, {prolog_service.q(f'Testigo de {p.name}')}, {prolog_service.q(f'Observó movimientos sospechosos cerca de {p.name}')}, {prolog_service.q(target_s)}))")
            hora = f"2{idx%4}:15"
            prolog_service.query_all(f"assertz(registro_acceso({prolog_service.q(case_id)}, {prolog_service.q(target_s)}, {prolog_service.q(p.name)}, {prolog_service.q(hora)}, {prolog_service.q(cid)}, {prolog_service.q('presencia_registrada')}))")

        timeline_events = [
            ("18:00", f"Inicio de operaciones regulares en {case.title}.", "false"),
            ("20:30", "Se registra movimiento inusual y corte intermitente de cámaras.", "true"),
            ("22:15", "Ocurre el incidente principal del caso en el área restringida.", "true"),
            ("23:45", "Se activa la alarma y se descubre la evidencia en la escena.", "true"),
            ("06:00", "Llega el equipo de investigación para analizar los hechos.", "false")
        ]
        for h, ev, susp in timeline_events:
            prolog_service.query_all(f"assertz(linea_tiempo({prolog_service.q(case_id)}, {prolog_service.q(h)}, {prolog_service.q(ev)}, {susp}))")

        # Persistir archivos
        prolog_service.query_all("guardar_casos")
        prolog_service.query_all("guardar_motivos_medios")
        prolog_service.query_all("guardar_evidencias")
        prolog_service.query_all("guardar_relaciones_evidencia")
        prolog_service.query_all("guardar_declaraciones")

    return {
        "success": True,
        "message": f"Caso '{case_id}' actualizado exitosamente en Prolog.",
        "case": {
            "id": case_id,
            "title": case.title,
            "description": case.description,
            "difficulty": case.difficulty,
            "suspectsCount": len(case.suspects or []) if case.suspects is not None else None,
            "evidenceCount": len(case.evidence or []) if case.evidence is not None else None,
            "placesCount": len(case.places or []) if case.places is not None else None
        }
    }


@router.delete("/cases/{case_id}")
def delete_case(case_id: str):
    existente = prolog_service.query_once(f"caso({prolog_service.q(case_id)},_,_,_)")
    if existente is None:
        raise HTTPException(status_code=404, detail="Caso no encontrado.")
    
    q = f"eliminar_caso({prolog_service.q(case_id)})"
    prolog_service.query_all(q)
    
    return {
        "success": True,
        "message": f"Caso '{case_id}' y todos sus datos asociados fueron eliminados de Prolog."
    }


# -----------------------------------------------------------------------------
# SOSPECHOSOS / PERSONAS
# -----------------------------------------------------------------------------

@router.post("/cases/{case_id}/suspects")
def create_suspect(case_id: str, suspect: SuspectCreate):
    existente = prolog_service.query_once(f"caso({prolog_service.q(case_id)},_,_,_)")
    if existente is None:
        raise HTTPException(status_code=404, detail="Caso no encontrado.")
    
    q = f"crear_persona({prolog_service.q(case_id)}, {prolog_service.q(suspect.id)}, {prolog_service.q(suspect.name)}, {suspect.type})"
    prolog_service.query_all(q)
    
    return {
        "success": True,
        "message": f"Sospechoso '{suspect.name}' registrado en caso '{case_id}'."
    }


@router.delete("/cases/{case_id}/suspects/{suspect_id}")
def delete_suspect(case_id: str, suspect_id: str):
    q = f"eliminar_persona({prolog_service.q(case_id)}, {prolog_service.q(suspect_id)})"
    prolog_service.query_all(q)
    return {
        "success": True,
        "message": f"Sospechoso '{suspect_id}' eliminado de Prolog."
    }


# -----------------------------------------------------------------------------
# EVIDENCIAS
# -----------------------------------------------------------------------------

@router.post("/cases/{case_id}/evidence")
def create_evidence(case_id: str, evidence: EvidenceCreate):
    q = f"crear_evidencia({prolog_service.q(case_id)}, {prolog_service.q(evidence.id)}, {evidence.type}, {prolog_service.q(evidence.description)}, {prolog_service.q(evidence.place)})"
    prolog_service.query_all(q)
    return {
        "success": True,
        "message": f"Evidencia '{evidence.id}' registrada en Prolog."
    }


@router.delete("/cases/{case_id}/evidence/{evidence_id}")
def delete_evidence(case_id: str, evidence_id: str):
    q = f"eliminar_evidencia({prolog_service.q(case_id)}, {prolog_service.q(evidence_id)})"
    prolog_service.query_all(q)
    return {
        "success": True,
        "message": f"Evidencia '{evidence_id}' eliminada de Prolog."
    }
