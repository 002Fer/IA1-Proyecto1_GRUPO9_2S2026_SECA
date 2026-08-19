% =========================================================================
% REGLAS DE CONTRADICCIONES, DECLARACIONES Y COMPLICES (RESPONSABILIDAD 4)
% =========================================================================

:- consult('casos.pl').
:- consult('evidencias.pl').
:- consult('data/declaraciones_data.pl').

% -------------------------------------------------------------------------
% 1. CONTRADICE EVIDENCIA
% Una persona contradice una evidencia si afirma estar en un lugar diferente
% a una hora registrada objetivamente por camaras, logs o pruebas fisicas.
% -------------------------------------------------------------------------

contradice_evidencia(Caso, Persona, Evidencia, Detalle) :-
    declaracion(Caso, Persona, Afirmacion, _, _, LugarAfirmado),
    registro_ubicacion_real(Caso, Persona, HoraReal, LugarReal, Fuente),
    LugarAfirmado \= LugarReal,
    evidencia(Caso, Evidencia, _, _, LugarReal),
    atomic_list_concat([Persona, ' afirmo estar en ', LugarAfirmado, ' pero evidencia/registro (', Fuente, ') lo situa en ', LugarReal, ' a las ', HoraReal, '. Declaracion: "', Afirmacion, '"'], Detalle).

% Variante directa simplificada para consultas breves:
contradice_evidencia_simple(Caso, Persona, Evidencia) :-
    declaracion(Caso, Persona, _, _, _, LugarAfirmado),
    registro_ubicacion_real(Caso, Persona, _, LugarReal, _),
    LugarAfirmado \= LugarReal,
    evidencia(Caso, Evidencia, _, _, LugarReal).


% -------------------------------------------------------------------------
% 2. CONTRADICE DECLARACION
% Dos personas se contradicen si la declaracion de una choca directamente
% con lo declarado o presenciado por la otra en la misma franja o tema.
% -------------------------------------------------------------------------

contradice_declaracion(Caso, Persona1, Persona2, Tema) :-
    Persona1 \= Persona2,
    declaracion(Caso, Persona1, Afirmacion1, _, _, _),
    declaracion(Caso, Persona2, Afirmacion2, _, _, _),
    registro_ubicacion_real(Caso, Persona1, _, LugarReal, _),
    declaracion(Caso, Persona2, _, _, _, LugarReal),
    atomic_list_concat([Persona1, ' declara: "', Afirmacion1, '" lo cual es desmentido por la declaracion de ', Persona2, ': "', Afirmacion2, '"'], Tema).

% Contradiccion por presencia atestiguada (ejemplo: testigo desmiente la coartada)
contradice_declaracion_testigo(Caso, PersonaMentirosa, Testigo, Detalle) :-
    declaracion(Caso, PersonaMentirosa, Afirmacion, _, _, LugarAfirmado),
    declaracion(Caso, Testigo, AfirmacionTestigo, _, _, _),
    registro_ubicacion_real(Caso, PersonaMentirosa, Hora, LugarReal, _),
    LugarAfirmado \= LugarReal,
    PersonaMentirosa \= Testigo,
    atomic_list_concat([Testigo, ' atestigua en su declaracion ("', AfirmacionTestigo, '") la presencia de ', PersonaMentirosa, ' en ', LugarReal, ' a las ', Hora, ', contradiciendo que estuvo en ', LugarAfirmado, ' ("', Afirmacion, '")'], Detalle).


% -------------------------------------------------------------------------
% 3. DIO INFORMACION FALSA
% Una persona dio informacion falsa si su declaracion contradice registros
% reales u otras pruebas comprobadas del caso.
% -------------------------------------------------------------------------

dio_informacion_falsa(Caso, Persona, Razon) :-
    contradice_evidencia(Caso, Persona, Evidencia, DetalleEv),
    atomic_list_concat(['Informacion falsa respecto a evidencia ', Evidencia, ': ', DetalleEv], Razon).

dio_informacion_falsa(Caso, Persona, Razon) :-
    contradice_declaracion_testigo(Caso, Persona, Testigo, DetalleTest),
    atomic_list_concat(['Informacion falsa constatada por testigo ', Testigo, ': ', DetalleTest], Razon).


% -------------------------------------------------------------------------
% 4. POSIBLES COMPLICES
% Un individuo es posible complice si tiene relacion previa registrada.
% -------------------------------------------------------------------------

posibles_complices(Caso, Principal, Complice, Razon) :-
    relacion_previa(Caso, Principal, Complice, TipoRel),
    Principal \= Complice,
    atomic_list_concat([Complice, ' es posible complice de ', Principal, ' debido a relacion previa (', TipoRel, ') en el caso.'], Razon).

posibles_complices(Caso, Principal, Complice, Razon) :-
    relacion_previa(Caso, Complice, Principal, TipoRel),
    Principal \= Complice,
    atomic_list_concat([Complice, ' es posible complice de ', Principal, ' debido a relacion previa (', TipoRel, ') en el caso.'], Razon).


% -------------------------------------------------------------------------
% 5. UTILITARIOS / CONSULTAS AUXILIARES
% -------------------------------------------------------------------------

obtener_declaraciones(Caso, Persona, Declaracion) :-
    declaracion(Caso, Persona, Declaracion, _, _, _).

lista_contradicciones_caso(Caso, ListaContradicciones) :-
    findall(
        c(Persona, Evidencia, Detalle),
        contradice_evidencia(Caso, Persona, Evidencia, Detalle),
        ListaContradicciones
    ).

lista_complices_caso(Caso, SospechosoPrincipal, ListaComplices) :-
    findall(
        complice(Complice, Razon),
        posibles_complices(Caso, SospechosoPrincipal, Complice, Razon),
        ListaComplices
    ).
