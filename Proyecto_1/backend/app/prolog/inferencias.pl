% INFERENCIAS - LOGIC DETECTIVE
% Reglas generales de puntaje utilizadas por el equipo.
:- consult('casos.pl').
:- consult('motivos_medios.pl').
:- consult('evidencias.pl').

% PUNTAJE POR MOTIVO
puntaje_motivo(Persona,Caso,1) :-
    posee_motivo(Persona,Caso).

% PUNTAJE POR MEDIO
puntaje_medio(Persona,Caso,1) :-
    once(posee_medios(Persona,Caso)).

% PUNTAJE POR EVIDENCIAS
puntaje_evidencias(Persona,Caso,Puntaje) :-
    cantidad_evidencias(Caso,Persona,Puntaje).

% PUNTAJE TOTAL
puntaje_sospechoso(Persona,Caso,Puntaje) :-
    puntaje_motivo(Persona,Caso,PuntajeMotivo),
    puntaje_medio(Persona,Caso,PuntajeMedio),
    puntaje_evidencias(Persona,Caso,PuntajeEvidencias),
    Puntaje is PuntajeMotivo + PuntajeMedio + PuntajeEvidencias.

% La regla sospechoso_principal/2 pertenece a Responsabilidad 3 y se define
% en reglas_investigacion.pl con el orden sospechoso_principal(Caso, Persona).

% EXPLICACION DEL SOSPECHOSO
explicacion_sospechoso(Persona,Caso,Motivos,Medios,Evidencias,Puntaje) :-
    sospechoso_principal(Caso,Persona),
    justificacion_indicio(Persona,Caso,Motivos,Medios,Evidencias),
    puntaje_sospechoso(Persona,Caso,Puntaje).

% DETERMINAR CULPABLE (compatibilidad con las reglas generales del equipo)
culpable(Persona,Caso) :-
    sospechoso_principal(Caso,Persona),
    indicio_completo(Persona,Caso).