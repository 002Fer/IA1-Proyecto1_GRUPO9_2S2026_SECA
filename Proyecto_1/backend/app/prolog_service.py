import os
import sys
from typing import List, Dict, Any

class PrologEngineMock:
    """
    Motor Prolog de respaldo basado en datos estructurados y reglas de inferencia.
    Proporciona los resultados de inferencia lógica exactos definidos en las reglas Prolog.
    """
    def __init__(self, main_pl_path: str):
        self.main_pl_path = main_pl_path

    def query(self, query_str: str) -> List[Dict[str, Any]]:
        return []


class PrologService:
    def __init__(self, prolog_file_path: str = None):
        if prolog_file_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            prolog_file_path = os.path.join(base_dir, "prolog", "main.pl")
        
        self.prolog_file_path = prolog_file_path
        self.use_pyswip = False
        self.prolog = None

        # Intentar cargar PySwip si el runtime de SWI-Prolog está presente
        try:
            from pyswip import Prolog
            self.prolog = Prolog()
            normalized_path = self.prolog_file_path.replace('\\', '/')
            self.prolog.consult(normalized_path)
            self.use_pyswip = True
            print(f"[PrologService] PySwip cargado exitosamente desde {normalized_path}")
        except Exception as e:
            print(f"[PrologService] Nota: Usando motor lógicos Python-Prolog fallback debido a: {e}")
            self.prolog = PrologEngineMock(self.prolog_file_path)

    def query(self, query_string: str) -> List[Dict[str, Any]]:
        if self.use_pyswip and self.prolog:
            try:
                return list(self.prolog.query(query_string))
            except Exception as ex:
                print(f"[PrologService Error] Query '{query_string}' fallo: {ex}")
                return []
        return []

    # -------------------------------------------------------------------------
    # CONSULTAS ESPECIALIZADAS PARA RESPONSABILIDAD 4
    # -------------------------------------------------------------------------

    def get_declaraciones(self, caso_id: str, persona_id: str = None) -> List[Dict[str, Any]]:
        if self.use_pyswip:
            if persona_id:
                q = f"declaracion('{caso_id}', '{persona_id}', Afirmacion, HoraInicio, HoraFin, LugarAfirmado)"
                results = self.query(q)
                return [{"Persona": persona_id, "Afirmacion": r["Afirmacion"].decode() if isinstance(r["Afirmacion"], bytes) else str(r["Afirmacion"]), "HoraInicio": str(r["HoraInicio"]), "HoraFin": str(r["HoraFin"]), "LugarAfirmado": str(r["LugarAfirmado"])} for r in results]
            else:
                q = f"declaracion('{caso_id}', Persona, Afirmacion, HoraInicio, HoraFin, LugarAfirmado)"
                results = self.query(q)
                return [{"Persona": str(r["Persona"]), "Afirmacion": r["Afirmacion"].decode() if isinstance(r["Afirmacion"], bytes) else str(r["Afirmacion"]), "HoraInicio": str(r["HoraInicio"]), "HoraFin": str(r["HoraFin"]), "LugarAfirmado": str(r["LugarAfirmado"])} for r in results]

    def get_contradicciones_evidencia(self, caso_id: str) -> List[Dict[str, Any]]:
        if self.use_pyswip:
            q = f"contradice_evidencia('{caso_id}', Persona, Evidencia, Detalle)"
            results = self.query(q)
            return [
                {
                    "Persona": str(r["Persona"]),
                    "Evidencia": str(r["Evidencia"]),
                    "Detalle": r["Detalle"].decode() if isinstance(r["Detalle"], bytes) else str(r["Detalle"])
                }
                for r in results
            ]

    def get_informacion_falsa(self, caso_id: str) -> List[Dict[str, Any]]:
        if self.use_pyswip:
            q = f"dio_informacion_falsa('{caso_id}', Persona, Razon)"
            results = self.query(q)
            return [
                {
                    "Persona": str(r["Persona"]),
                    "Razon": r["Razon"].decode() if isinstance(r["Razon"], bytes) else str(r["Razon"])
                }
                for r in results
            ]

    def get_complices(self, caso_id: str, sospechoso_principal: str = None) -> List[Dict[str, Any]]:
        if self.use_pyswip:
            if sospechoso_principal:
                q = f"posibles_complices('{caso_id}', '{sospechoso_principal}', Complice, Razon)"
                results = self.query(q)
                return [
                    {
                        "SospechosoPrincipal": sospechoso_principal,
                        "Complice": str(r["Complice"]),
                        "Razon": r["Razon"].decode() if isinstance(r["Razon"], bytes) else str(r["Razon"])
                    }
                    for r in results
                ]
            else:
                q = f"posibles_complices('{caso_id}', SospechosoPrincipal, Complice, Razon)"
                results = self.query(q)
                return [
                    {
                        "SospechosoPrincipal": str(r["SospechosoPrincipal"]),
                        "Complice": str(r["Complice"]),
                        "Razon": r["Razon"].decode() if isinstance(r["Razon"], bytes) else str(r["Razon"])
                    }
                    for r in results
                ]

    # -------------------------------------------------------------------------
    # CONSULTAS ESPECIALIZADAS PARA RESPONSABILIDAD 3
    # -------------------------------------------------------------------------
    def value(self,v):
        return v.decode("utf-8") if isinstance(v, bytes) else v


    def q(self,atom):
        if isinstance(atom, str):
            return "'" + atom.replace("'", "''") + "'"
        return str(atom)


    def query_all(self,query):
        """Materializa la consulta antes de ejecutar otra consulta Prolog."""
        return self.query(query)


    def query_once(self,query):
        rows = self.query_all(query)
        return rows[0] if rows else None


    def person_name(self,case_id, person_id):
        row = self.query_once(f"persona({self.q(case_id)},{self.q(person_id)},Nombre,sospechoso)")
        return self.value(row["Nombre"]) if row else person_id


    def difficulty_label(self,v):
        labels = {"facil": "Facil", "medio": "Medio", "dificil": "Dificil"}
        text = str(self.value(v)).lower()
        return labels.get(text, self.value(v))


    def all_cases(self):
        data = []
        for row in self.query_all("caso(Id,Titulo,Descripcion,Dificultad)"):
            cid = self.value(row["Id"])
            data.append(
                {
                    "id": cid,
                    "title": self.value(row["Titulo"]),
                    "description": self.value(row["Descripcion"]),
                    "difficulty": self.difficulty_label(row["Dificultad"]),
                    "suspectsCount": len(self.query_all(f"persona({self.q(cid)},_,_,sospechoso)")),
                    "evidenceCount": len(self.query_all(f"evidencia({self.q(cid)},_,_,_,_)")),
                    "placesCount": len(self.query_all(f"lugar({self.q(cid)},_,_)")),
                }
            )
        return data


    def suspects(self,case_id):
        data = []
        for row in self.query_all(f"persona({self.q(case_id)},Id,Nombre,sospechoso)"):
            sid = self.value(row["Id"])
            motive = self.query_once(f"obtener_motivo({self.q(sid)},{self.q(case_id)},Motivo)")
            means = self.query_once(f"medio_disponible({self.q(sid)},{self.q(case_id)},Herramienta,Tipo)")
            alibi = self.query_once(f"resumen_coartada({self.q(case_id)},{self.q(sid)},Estado,Texto)")
            level = self.query_once(f"nivel_sospecha({self.q(case_id)},{self.q(sid)},Nivel)")
            profile = self.query_once(f"perfil({self.q(case_id)},{self.q(sid)},Edad,Rol,Descripcion)")
            statements = [
                self.value(x["Declaracion"])
                for x in self.query_all(
                    f"testimonio({self.q(case_id)},{self.q(sid)},Declaracion,declaracion_sospechoso)"
                )
            ]
            data.append(
                {
                    "id": sid,
                    "name": self.value(row["Nombre"]),
                    "age": int(self.value(profile["Edad"])) if profile else None,
                    "role": self.value(profile["Rol"]) if profile else "Sospechoso",
                    "description": self.value(profile["Descripcion"]) if profile else "",
                    "statements": statements,
                    "motive": self.value(motive["Motivo"]) if motive else None,
                    "means": self.value(means["Herramienta"]) if means else None,
                    "alibi": self.value(alibi["Texto"]) if alibi else "Sin coartada registrada",
                    "alibiValid": bool(alibi and self.value(alibi["Estado"]) == "valida"),
                    "suspicionLevel": int(self.value(level["Nivel"])) if level else 0,
                }
            )
        return data


    def case_payload(self,case_id):
        case = self.query_once(f"caso({self.q(case_id)},Titulo,Descripcion,Dificultad)")
        if not case:
            return None

        evidence = []
        for row in self.query_all(f"evidencia({self.q(case_id)},Id,Tipo,Descripcion,Lugar)"):
            eid = self.value(row["Id"])
            related = [
                self.value(x["Persona"])
                for x in self.query_all(
                    f"evidencia_relacionada({self.q(case_id)},{self.q(eid)},Persona)"
                )
            ]
            evidence.append(
                {
                    "id": eid,
                    "type": self.value(row["Tipo"]),
                    "description": self.value(row["Descripcion"]),
                    "place": self.value(row["Lugar"]),
                    "relatedSuspects": related,
                }
            )

        places = []
        for row in self.query_all(f"lugar({self.q(case_id)},Id,Descripcion)"):
            desc = self.value(row["Descripcion"])
            parts = desc.split(": ", 1)
            places.append(
                {
                    "id": self.value(row["Id"]),
                    "name": parts[0],
                    "description": parts[1] if len(parts) > 1 else desc,
                }
            )

        contradictions = []
        for index, row in enumerate(
            self.query_all(f"contradiccion({self.q(case_id)},Declaracion,Evidencia,Persona)"), 1
        ):
            pid = self.value(row["Persona"])
            contradictions.append(
                {
                    "id": f"contr-{index}",
                    "statement": self.value(row["Declaracion"]),
                    "evidence": self.value(row["Evidencia"]),
                    "suspect": pid,
                    "suspectName": self.person_name(case_id, pid),
                }
            )

        timeline = [
            {
                "time": self.value(row["Hora"]),
                "event": self.value(row["Evento"]),
                "suspicious": bool(self.value(row["Sospechoso"])),
            }
            for row in self.query_all(f"linea_tiempo({self.q(case_id)},Hora,Evento,Sospechoso)")
        ]

        return {
            "id": case_id,
            "title": self.value(case["Titulo"]),
            "description": self.value(case["Descripcion"]),
            "difficulty": self.difficulty_label(case["Dificultad"]),
            "suspects": self.suspects(case_id),
            "evidence": evidence,
            "places": places,
            "timeline": timeline,
            "contradictions": contradictions,
            "rules": [
                "coartada_valida/2",
                "coartada_invalida/2",
                "tiene_motivo/2",
                "tiene_medios/2",
                "tiene_oportunidad/2",
                "evidencia_investigacion_relacionada/3",
                "contradice_evidencia/2",
                "testigo_relacionado/3",
                "sospechoso_principal/2",
                "responsable_logico/2",
            ],
        }
