% LOGIC DETECTIVE - MODULO: MOTIVOS Y MEDIOS
:- consult('casos.pl').
:- consult('data/motivos_medios_data.pl').

% 1. MOTIVOS
% Una persona posee un motivo cuando existe un motivo
% registrado para ella y este no corresponde a "ninguno".
posee_motivo(Persona, Caso) :-
    motivo(Caso, Persona, Motivo),
    Motivo \= ninguno_identificado,
    Motivo \= ninguno_claro.


% 2. MEDIOS
% Una persona posee medios si dispone de al menos uno
% de los tipos de medios definidos para el caso.
posee_medios(Persona, Caso) :-
    medio_fisico(Persona, Caso).

posee_medios(Persona, Caso) :-
    medio_tecnico(Persona, Caso).

posee_medios(Persona, Caso) :-
    medio_conocimiento(Persona, Caso).


% 3. MEDIOS FISICOS
% Una persona posee un medio físico cuando tiene una
% herramienta clasificada como "acceso".
medio_fisico(Persona, Caso) :-
    posee_herramienta(Caso,Persona,Herramienta),
    herramienta(Caso,Herramienta,acceso).


% 4. MEDIOS TECNICOS
% Una persona posee un medio técnico cuando tiene una
% herramienta cuyo tipo no es "acceso".
medio_tecnico(Persona, Caso) :-
    posee_herramienta(Caso,Persona,Herramienta),
    herramienta(Caso,Herramienta,Tipo),
    Tipo \= acceso.



% 5. MEDIOS POR CONOCIMIENTO
% Una persona posee medios por conocimiento cuando
% posee información relevante registrada para el caso.
medio_conocimiento(Persona, Caso) :-
    conocimiento(Caso,Persona,_).


% 6. OBTENER HERRAMIENTA
% Permite consultar qué herramienta posee una persona.
tiene_herramienta(Persona, Caso, Herramienta) :-
    posee_herramienta(Caso,Persona,Herramienta).


% 6.1 OBTENER MEDIO DISPONIBLE
% Permite obtener la herramienta y su tipo para una persona.
medio_disponible(Persona, Caso, Herramienta, Tipo) :-
    posee_herramienta(Caso,Persona,Herramienta),
    herramienta(Caso,Herramienta,Tipo).


% 7. OBTENER MOTIVO
% Permite obtener el motivo concreto de una persona.
obtener_motivo(Persona, Caso, Motivo) :-
    motivo(Caso,Persona,Motivo),
    Motivo \= ninguno_identificado,
    Motivo \= ninguno_claro.


% 8. OBTENER CONOCIMIENTO
% Permite consultar el conocimiento registrado de una persona.
tiene_conocimiento(Persona, Caso, Conocimiento) :-
    conocimiento(Caso,Persona,Conocimiento).


% PERSONAS CON MOTIVO
persona_con_motivo(Caso, Persona) :-
    persona(Caso,Persona,_ ,sospechoso),
    once(posee_motivo(Persona,Caso)).

% PERSONAS CON MEDIOS
persona_con_medio(Caso, Persona) :-
    persona(Caso,Persona,_,sospechoso),
    once(posee_medios(Persona,Caso)).


% MOTIVO Y MEDIO
tiene_motivo_y_medio(Persona,Caso) :-
    posee_motivo(Persona,Caso),
    once(posee_medios(Persona,Caso)).


% MOTIVO MEDIO Y EVIDENCIA
indicio_completo(Persona,Caso) :-
    posee_motivo(Persona,Caso),
    once(posee_medios(Persona,Caso)),
    once(indicio_relevante(Persona,Caso)).