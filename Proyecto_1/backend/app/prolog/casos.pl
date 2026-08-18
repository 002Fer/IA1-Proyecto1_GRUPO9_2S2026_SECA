% CASOS - LOGIC DETECTIVE
:- consult('data/casos_data.pl').

obtener_caso(Id,Titulo,Descripcion,Dificultad) :-
    caso(Id,Titulo,Descripcion,Dificultad).

obtener_persona(Caso,Id,Nombre,Tipo) :-
    persona(Caso,Id,Nombre,Tipo).

listar_casos(Id,Titulo,Descripcion,Dificultad) :-
    caso(Id,Titulo,Descripcion,Dificultad).

listar_personas(Caso,Id,Nombre,Tipo) :-
    persona(Caso,Id,Nombre,Tipo).
