% INFERENCIAS - LOGIC DETECTIVE
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

% SOSPECHOSO PRINCIPAL
sospechoso_principal(Persona,Caso) :-
    puntaje_sospechoso(Persona,Caso,Puntaje),
    \+ (puntaje_sospechoso(_,Caso,PuntajeMayor), PuntajeMayor > Puntaje).

 % EXPLICACION DEL SOSPECHOSO - Esplica por que alguien es sospechoso
explicacion_sospechoso(Persona,Caso,Motivos,Medios,Evidencias,Puntaje) :-
    sospechoso_principal(Persona,Caso),
    justificacion_indicio(Persona,Caso,Motivos,Medios,Evidencias),
    puntaje_sospechoso(Persona,Caso,Puntaje).

% DETERMINAR CULPABLE
culpable(Persona,Caso) :-
    sospechoso_principal(Persona,Caso),
    indicio_completo(Persona,Caso).