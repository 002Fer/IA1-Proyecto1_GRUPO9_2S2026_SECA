% EVIDENCIAS - LOGIC DETECTIVE
:- consult('casos.pl').
:- consult('data/evidencias_data.pl').

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