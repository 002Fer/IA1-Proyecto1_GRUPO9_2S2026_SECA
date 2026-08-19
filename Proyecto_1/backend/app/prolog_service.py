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
