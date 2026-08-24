% LOGIC DETECTIVE - RESPONSABILIDAD 1

% ==================== CONVERSION DE HORAS ====================

hora_a_minutos(Hora, Minutos) :-
    atomic_list_concat([Horas, MinutosTexto], ':', Hora),
    atom_number(Horas, H),
    atom_number(MinutosTexto, M),
    Minutos is H * 60 + M.


hora_en_intervalo(Hora, Inicio, Fin) :-
    hora_a_minutos(Hora, H),
    hora_a_minutos(Inicio, I),
    hora_a_minutos(Fin, F),
    (
        I =< F ->
        H >= I,
        H =< F
    ;
        (H >= I ; H =< F)
    ).


% ==================== ACCESO ====================

tuvo_acceso(Persona, Caso) :-
    persona(Caso, Persona, _, sospechoso),
    once((
        registro_acceso(Caso, Persona, Lugar, _, _, _),
        ubicacion_incidente(Caso, Lugar)
    )).


% ==================== OPORTUNIDAD ====================

tuvo_oportunidad(Persona, Caso) :-
    tuvo_acceso(Persona, Caso),
    once((
        registro_acceso(Caso, Persona, Lugar, Hora, _, _),
        ubicacion_incidente(Caso, Lugar),
        horario_incidente(Caso, Inicio, Fin),
        hora_en_intervalo(Hora, Inicio, Fin)
    )).