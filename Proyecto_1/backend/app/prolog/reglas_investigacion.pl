% LOGIC DETECTIVE - RESPONSABILIDAD 3
% Reglas para coartadas, oportunidad, evidencias y acusacion final.
:- consult('casos.pl').
:- consult('motivos_medios.pl').
:- consult('evidencias.pl').
:- consult('data/investigacion_data.pl').

% ---------------- COARTADAS ----------------
coartada_invalida(Caso, Persona) :-
    coartada(Caso, Persona, _, false, _), !.
coartada_invalida(Caso, Persona) :-
    contradiccion(Caso, _, _, Persona), !.

coartada_valida(Caso, Persona) :-
    coartada(Caso, Persona, _, true, _),
    \+ coartada_invalida(Caso, Persona).

resumen_coartada(Caso, Persona, invalida, Texto) :-
    coartada(Caso, Persona, Texto, _, _),
    coartada_invalida(Caso, Persona), !.
resumen_coartada(Caso, Persona, valida, Texto) :-
    coartada(Caso, Persona, Texto, _, _),
    coartada_valida(Caso, Persona).

% ---------------- INVESTIGACION ----------------
acceso_registrado(Caso, Persona) :-
    registro_acceso(Caso, Persona, _, _, _, _).

tiene_oportunidad(Caso, Persona) :-
    acceso_registrado(Caso, Persona), !.
tiene_oportunidad(Caso, Persona) :-
    coartada_invalida(Caso, Persona).

tiene_motivo(Caso, Persona) :-
    posee_motivo(Persona, Caso).

tiene_medios(Caso, Persona) :-
    once(posee_medios(Persona, Caso)).

% La implementacion del equipo usa evidencia_relacionada(Caso,Evidencia,Persona).
evidencia_investigacion_relacionada(Caso, Persona, Evidencia) :-
    evidencia_relacionada(Caso, Evidencia, Persona).

contradice_evidencia(Caso, Persona) :-
    contradiccion(Caso, _, _, Persona).

testigo_relacionado(Caso, Persona, Testigo) :-
    testigo(Caso, Testigo, _, _, Persona).

% ---------------- NIVEL DE SOSPECHA ----------------
puntaje_sospecha(Caso, Persona, Score) :-
    persona(Caso, Persona, _, sospechoso),
    ( tiene_motivo(Caso, Persona) -> M = 2 ; M = 0 ),
    ( tiene_medios(Caso, Persona) -> D = 2 ; D = 0 ),
    ( tiene_oportunidad(Caso, Persona) -> O = 2 ; O = 0 ),
    ( coartada_invalida(Caso, Persona) -> A = 3 ; A = 0 ),
    findall(E, evidencia_investigacion_relacionada(Caso, Persona, E), Evidencias),
    length(Evidencias, N),
    BonusE is min(N, 4),
    Score is M + D + O + A + BonusE.

nivel_sospecha(Caso, Persona, Nivel) :-
    puntaje_sospecha(Caso, Persona, Score),
    findall(S, puntaje_sospecha(Caso, _, S), Scores),
    max_list(Scores, Max),
    ( Max =:= 0 -> Nivel = 0 ; Nivel is round((Score * 100) / Max) ).

sospechoso_principal(Caso, Persona) :-
    max_sospecha(Caso, Persona, _), !.

max_sospecha(Caso, Persona, Score) :-
    findall(S-P, puntaje_sospecha(Caso, P, S), Pairs),
    sort(Pairs, Sorted),
    reverse(Sorted, [Score-Persona|_]).

% Responsable logico: principal sospechoso que ademas cumple motivo, medios,
% oportunidad y tiene una coartada invalidada.
responsable_logico(Caso, Persona) :-
    sospechoso_principal(Caso, Persona),
    tiene_motivo(Caso, Persona),
    tiene_medios(Caso, Persona),
    tiene_oportunidad(Caso, Persona),
    coartada_invalida(Caso, Persona), !.

% Respaldo para casos donde la maxima puntuacion no coincide con todos los criterios.
responsable_logico(Caso, Persona) :-
    persona(Caso, Persona, _, sospechoso),
    tiene_motivo(Caso, Persona),
    tiene_medios(Caso, Persona),
    tiene_oportunidad(Caso, Persona),
    coartada_invalida(Caso, Persona),
    !.

posible_complice(Caso, Persona) :-
    persona(Caso, Persona, _, sospechoso),
    tiene_oportunidad(Caso, Persona),
    ( tiene_motivo(Caso, Persona) ; tiene_medios(Caso, Persona) ),
    \+ responsable_logico(Caso, Persona).

% ---------------- EXPLICACION Y ACUSACION ----------------
regla_activada(Caso, Persona, coartada_invalida) :- coartada_invalida(Caso, Persona).
regla_activada(Caso, Persona, coartada_valida) :- coartada_valida(Caso, Persona).
regla_activada(Caso, Persona, tiene_motivo) :- tiene_motivo(Caso, Persona).
regla_activada(Caso, Persona, tiene_medios) :- tiene_medios(Caso, Persona).
regla_activada(Caso, Persona, tiene_oportunidad) :- tiene_oportunidad(Caso, Persona).
regla_activada(Caso, Persona, contradice_evidencia) :- contradice_evidencia(Caso, Persona).
regla_activada(Caso, Persona, evidencia_relacionada) :- evidencia_investigacion_relacionada(Caso, Persona, _).
regla_activada(Caso, Persona, testigo_relacionado) :- testigo_relacionado(Caso, Persona, _).
regla_activada(Caso, Persona, sospechoso_principal) :- sospechoso_principal(Caso, Persona).
regla_activada(Caso, Persona, responsable_logico) :- responsable_logico(Caso, Persona).

explicacion_acusacion(Caso, Persona, Reglas) :-
    findall(Regla, regla_activada(Caso, Persona, Regla), Raw),
    sort(Raw, Reglas).

acusacion_final(Caso, Persona, correcta, Reglas) :-
    responsable_logico(Caso, Persona),
    explicacion_acusacion(Caso, Persona, Reglas), !.
acusacion_final(Caso, Persona, incorrecta, Reglas) :-
    persona(Caso, Persona, _, sospechoso),
    \+ responsable_logico(Caso, Persona),
    explicacion_acusacion(Caso, Persona, Reglas).

% ---------------- BITACORA ----------------
:- dynamic accion_bitacora/3.
bitacora(Caso, Accion, MarcaTiempo) :-
    assertz(accion_bitacora(Caso, Accion, MarcaTiempo)).
