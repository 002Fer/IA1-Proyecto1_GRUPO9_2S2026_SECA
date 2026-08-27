% EVIDENCIAS - LOGIC DETECTIVE
:- consult('casos.pl').
:- consult('data/evidencias_data.pl').
:- consult('motivos_medios.pl').

% OBTENER EVIDENCIA
obtener_evidencia(Caso, Evidencia, Tipo, Descripcion, Lugar) :-
    evidencia(Caso, Evidencia, Tipo, Descripcion, Lugar).

% OBTENER EVIDENCIAS DE UN CASO
evidencia_del_caso(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, _, _, _).

% OBTENER EVIDENCIAS DE UNA PERSONA
evidencia_de_persona(Caso, Persona, Evidencia) :-
    evidencia_relacionada(Caso, Evidencia, Persona).

% PERSONA RELACIONADA CON EVIDENCIA
persona_relacionada_evidencia(Caso, Evidencia, Persona) :-
    evidencia_relacionada(Caso, Evidencia, Persona).

% TIPO DE EVIDENCIA
tipo_evidencia(Caso, Evidencia, Tipo) :-
    evidencia(Caso, Evidencia, Tipo, _, _).

% LUGAR DE EVIDENCIA
lugar_evidencia(Caso, Evidencia, Lugar) :-
    evidencia(Caso, Evidencia, _, _, Lugar).

% EVIDENCIA FISICA
evidencia_fisica(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, fisica, _, _).

% EVIDENCIA DIGITAL
evidencia_digital(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, digital, _, _).

% EVIDENCIA TESTIMONIAL
evidencia_testimonial(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, testimonial, _, _).

% EVIDENCIA DOCUMENTAL
evidencia_documental(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, documental, _, _).

% EVIDENCIA QUIMICA
evidencia_quimica(Caso, Evidencia) :-
    evidencia(Caso, Evidencia, quimica, _, _).

% PERSONA TIENE EVIDENCIA RELACIONADA
tiene_evidencia(Caso, Persona) :-
    evidencia_relacionada(Caso, _, Persona).

% OBTENER DESCRIPCION DE EVIDENCIA
descripcion_evidencia(Caso, Evidencia, Descripcion) :-
    evidencia(Caso, Evidencia, _, Descripcion, _).

% CONTAR EVIDENCIAS DE UNA PERSONA
cantidad_evidencias(Caso, Persona, Cantidad) :-
    findall(Evidencia, evidencia_relacionada(Caso, Evidencia, Persona), Evidencias),
    length(Evidencias, Cantidad).

% INTEGRACION MOTIVOS MEDIOS Y EVIDENCIAS
indicio_relevante(Persona, Caso) :-
    posee_motivo(Persona, Caso),
    once(posee_medios(Persona, Caso)),
    once(tiene_evidencia(Caso, Persona)).

% JUSTIFICACION COMPLETA
justificacion_indicio(Persona, Caso, Motivos, Medios, Evidencias) :-
    findall(Motivo, (motivo(Caso, Persona, Motivo), Motivo \= ninguno_identificado, Motivo \= ninguno_claro), Motivos),
    findall(Herramienta, posee_herramienta(Caso, Persona, Herramienta), Medios),
    findall(Evidencia, evidencia_relacionada(Caso, Evidencia, Persona), Evidencias),
    Motivos \= [],
    Medios \= [],
    Evidencias \= [].


% RELACIONES ENTRE EVIDENCIAS Y SOSPECHOSOS
:- dynamic evidencia_relacionada/3.

% CASO 1
evidencia_relacionada('caso-1','ev-1','suspect-1').
evidencia_relacionada('caso-1','ev-5','suspect-4').
evidencia_relacionada('caso-1','ev-7','suspect-2').
evidencia_relacionada('caso-1','ev-8','suspect-2').
evidencia_relacionada('caso-1','ev-10','suspect-2').

% CASO 2
evidencia_relacionada('caso-2','ev-b3','suspect-b3').
evidencia_relacionada('caso-2','ev-b4','suspect-b3').
evidencia_relacionada('caso-2','ev-b5','suspect-b3').
evidencia_relacionada('caso-2','ev-b8','suspect-b4').

% CASO 3
evidencia_relacionada('caso-3','ev-c1','suspect-c1').
evidencia_relacionada('caso-3','ev-c3','suspect-c1').
evidencia_relacionada('caso-3','ev-c5','suspect-c1').
evidencia_relacionada('caso-3','ev-c8','suspect-c4').