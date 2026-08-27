% CRUD - LOGIC DETECTIVE
:- consult('casos.pl').
:- consult('data/motivos_medios_data.pl').
:- consult('data/evidencias_data.pl').
:- consult('data/evidencias_relaciones_data.pl').
:- consult('data/declaraciones_data.pl').

% Resolver ruta relativa al directorio de este archivo Prolog
ruta_archivo(Rel, Abs) :-
    ( source_file(crear_caso(_,_,_,_), File) ->
        file_directory_name(File, Dir),
        atomic_list_concat([Dir, '/', Rel], Abs)
    ;
        Abs = Rel
    ).

% CREAR CASO
crear_caso(Id,Titulo,Descripcion,Dificultad) :-
    \+ caso(Id,_,_,_),
    assertz(caso(Id,Titulo,Descripcion,Dificultad)),
    guardar_casos.

% ACTUALIZAR CASO
actualizar_caso(Id,Titulo,Descripcion,Dificultad) :-
    retract(caso(Id,_,_,_)),
    assertz(caso(Id,Titulo,Descripcion,Dificultad)),
    guardar_casos.

% ELIMINAR CASO - SIN DATOS HUERFANOS
eliminar_caso(Id) :-
    retractall(caso(Id,_,_,_)),
    retractall(persona(Id,_,_,_)),
    retractall(motivo(Id,_,_)),
    retractall(herramienta(Id,_,_)),
    retractall(posee_herramienta(Id,_,_)),
    retractall(objeto(Id,_,_)),
    retractall(posee_objeto(Id,_,_)),
    retractall(conocimiento(Id,_,_)),
    retractall(evidencia(Id,_,_,_,_)),
    retractall(evidencia_relacionada(Id,_,_)),
    retractall(declaracion(Id,_,_,_,_)),
    retractall(lugar(Id,_,_)),
    retractall(coartada(Id,_,_,_,_)),
    retractall(testimonio(Id,_,_,_)),
    retractall(contradiccion(Id,_,_,_)),
    retractall(linea_tiempo(Id,_,_,_)),
    retractall(testigo(Id,_,_,_,_)),
    retractall(camara(Id,_,_,_,_,_)),
    retractall(registro_acceso(Id,_,_,_,_,_)),
    retractall(perfil(Id,_,_,_,_)),
    guardar_casos,
    guardar_motivos_medios,
    guardar_evidencias,
    guardar_relaciones_evidencia,
    guardar_declaraciones.

% CREAR PERSONA
crear_persona(Caso,Id,Nombre,Tipo) :-
    caso(Caso,_,_,_),
    \+ persona(Caso,Id,_,_),
    assertz(persona(Caso,Id,Nombre,Tipo)),
    guardar_casos.

% ACTUALIZAR PERSONA
actualizar_persona(Caso,Id,Nombre,Tipo) :-
    retract(persona(Caso,Id,_,_)),
    assertz(persona(Caso,Id,Nombre,Tipo)),
    guardar_casos.

% ELIMINAR PERSONA
eliminar_persona(Caso,Id) :-
    retractall(persona(Caso,Id,_,_)),
    guardar_casos.

% GUARDAR DATOS
guardar_casos :-
    ruta_archivo('data/casos_data.pl', RutaCasos),
    open(RutaCasos,write,Stream),
    write(Stream,'% CASOS - LOGIC DETECTIVE'), nl(Stream), nl(Stream),
    write(Stream,':- dynamic caso/4.'), nl(Stream),
    write(Stream,':- dynamic persona/4.'), nl(Stream), nl(Stream),
    forall(caso(Id,Titulo,Descripcion,Dificultad),
           escribir_caso(Stream,Id,Titulo,Descripcion,Dificultad)),
    nl(Stream),
    forall(persona(Caso,Id,Nombre,Tipo),
           escribir_persona(Stream,Caso,Id,Nombre,Tipo)),
    close(Stream).

% ESCRIBIR CASO
escribir_caso(Stream,Id,Titulo,Descripcion,Dificultad) :-
    writeq(Stream,caso(Id,Titulo,Descripcion,Dificultad)),
    write(Stream,'.'),
    nl(Stream).

% ESCRIBIR PERSONA
escribir_persona(Stream,Caso,Id,Nombre,Tipo) :-
    writeq(Stream,persona(Caso,Id,Nombre,Tipo)),
    write(Stream,'.'),
    nl(Stream).

% CONSULTAR CASO
consultar_caso(Id,Titulo,Descripcion,Dificultad) :-
    caso(Id,Titulo,Descripcion,Dificultad).

% CONSULTAR PERSONA
consultar_persona(Caso,Id,Nombre,Tipo) :-
    persona(Caso,Id,Nombre,Tipo).

% CREAR MOTIVO
crear_motivo(Caso,Persona,Motivo) :-
    caso(Caso,_,_,_),
    \+ motivo(Caso,Persona,Motivo),
    assertz(motivo(Caso,Persona,Motivo)),
    guardar_motivos_medios.

% ACTUALIZAR MOTIVO
actualizar_motivo(Caso,Persona,NuevoMotivo) :-
    retract(motivo(Caso,Persona,_)),
    assertz(motivo(Caso,Persona,NuevoMotivo)),
    guardar_motivos_medios.

% ELIMINAR MOTIVO
eliminar_motivo(Caso,Persona) :-
    retractall(motivo(Caso,Persona,_)),
    guardar_motivos_medios.

% CREAR HERRAMIENTA
crear_herramienta(Caso,Herramienta,Tipo) :-
    caso(Caso,_,_,_),
    \+ herramienta(Caso,Herramienta,_),
    assertz(herramienta(Caso,Herramienta,Tipo)),
    guardar_motivos_medios.

% ELIMINAR HERRAMIENTA
eliminar_herramienta(Caso,Herramienta) :-
    retractall(herramienta(Caso,Herramienta,_)),
    retractall(posee_herramienta(Caso,_,Herramienta)),
    guardar_motivos_medios.

% ASIGNAR HERRAMIENTA
asignar_herramienta(Caso,Persona,Herramienta) :-
    persona(Caso,Persona,_,_),
    herramienta(Caso,Herramienta,_),
    \+ posee_herramienta(Caso,Persona,Herramienta),
    assertz(posee_herramienta(Caso,Persona,Herramienta)),
    guardar_motivos_medios.

% QUITAR HERRAMIENTA
quitar_herramienta(Caso,Persona,Herramienta) :-
    retractall(posee_herramienta(Caso,Persona,Herramienta)),
    guardar_motivos_medios.

% CREAR CONOCIMIENTO
crear_conocimiento(Caso,Persona,Conocimiento) :-
    persona(Caso,Persona,_,_),
    \+ conocimiento(Caso,Persona,Conocimiento),
    assertz(conocimiento(Caso,Persona,Conocimiento)),
    guardar_motivos_medios.

% ELIMINAR CONOCIMIENTO
eliminar_conocimiento(Caso,Persona,Conocimiento) :-
    retractall(conocimiento(Caso,Persona,Conocimiento)),
    guardar_motivos_medios.


% GUARDAR MOTIVOS Y MEDIOS
guardar_motivos_medios :-
    ruta_archivo('data/motivos_medios_data.pl', RutaMM),
    open(RutaMM,write,Stream),
    write(Stream,'% DATOS DE MOTIVOS Y MEDIOS'), nl(Stream), nl(Stream),
    write(Stream,':- dynamic motivo/3.'), nl(Stream),
    write(Stream,':- dynamic herramienta/3.'), nl(Stream),
    write(Stream,':- dynamic posee_herramienta/3.'), nl(Stream),
    write(Stream,':- dynamic objeto/3.'), nl(Stream),
    write(Stream,':- dynamic posee_objeto/3.'), nl(Stream),
    write(Stream,':- dynamic conocimiento/3.'), nl(Stream), nl(Stream),
    forall(motivo(Caso,Persona,Motivo),
           escribir_motivo(Stream,Caso,Persona,Motivo)),
    forall(herramienta(Caso,Herramienta,Tipo),
           escribir_herramienta(Stream,Caso,Herramienta,Tipo)),
    forall(posee_herramienta(Caso,Persona,Herramienta),
           escribir_posee_herramienta(Stream,Caso,Persona,Herramienta)),
    forall(objeto(Caso,Objeto,Tipo),
           escribir_objeto(Stream,Caso,Objeto,Tipo)),
    forall(posee_objeto(Caso,Persona,Objeto),
           escribir_posee_objeto(Stream,Caso,Persona,Objeto)),
    forall(conocimiento(Caso,Persona,Conocimiento),
           escribir_conocimiento(Stream,Caso,Persona,Conocimiento)),
    close(Stream).

% ESCRIBIR MOTIVO
escribir_motivo(Stream,Caso,Persona,Motivo) :-
    writeq(Stream,motivo(Caso,Persona,Motivo)),
    write(Stream,'.'), nl(Stream).

% ESCRIBIR HERRAMIENTA
escribir_herramienta(Stream,Caso,Herramienta,Tipo) :-
    writeq(Stream,herramienta(Caso,Herramienta,Tipo)),
    write(Stream,'.'), nl(Stream).

% ESCRIBIR HERRAMIENTA ASIGNADA
escribir_posee_herramienta(Stream,Caso,Persona,Herramienta) :-
    writeq(Stream,posee_herramienta(Caso,Persona,Herramienta)),
    write(Stream,'.'), nl(Stream).

% ESCRIBIR OBJETO
escribir_objeto(Stream,Caso,Objeto,Tipo) :-
    writeq(Stream,objeto(Caso,Objeto,Tipo)),
    write(Stream,'.'), nl(Stream).

% ESCRIBIR OBJETO POSEIDO
escribir_posee_objeto(Stream,Caso,Persona,Objeto) :-
    writeq(Stream,posee_objeto(Caso,Persona,Objeto)),
    write(Stream,'.'), nl(Stream).

% ESCRIBIR CONOCIMIENTO
escribir_conocimiento(Stream,Caso,Persona,Conocimiento) :-
    writeq(Stream,conocimiento(Caso,Persona,Conocimiento)),
    write(Stream,'.'), nl(Stream).


% CREAR OBJETO
crear_objeto(Caso,Objeto,Tipo) :-
    caso(Caso,_,_,_),
    \+ objeto(Caso,Objeto,_),
    assertz(objeto(Caso,Objeto,Tipo)),
    guardar_motivos_medios.

% CONSULTAR OBJETO
consultar_objeto(Caso,Objeto,Tipo) :-
    objeto(Caso,Objeto,Tipo).

% ACTUALIZAR OBJETO
actualizar_objeto(Caso,Objeto,NuevoTipo) :-
    retract(objeto(Caso,Objeto,_)),
    assertz(objeto(Caso,Objeto,NuevoTipo)),
    guardar_motivos_medios.

% ELIMINAR OBJETO
eliminar_objeto(Caso,Objeto) :-
    retractall(objeto(Caso,Objeto,_)),
    retractall(posee_objeto(Caso,_,Objeto)),
    guardar_motivos_medios.

% ASIGNAR OBJETO
asignar_objeto(Caso,Persona,Objeto) :-
    persona(Caso,Persona,_,_),
    objeto(Caso,Objeto,_),
    \+ posee_objeto(Caso,Persona,Objeto),
    assertz(posee_objeto(Caso,Persona,Objeto)),
    guardar_motivos_medios.

% CONSULTAR OBJETO POSEIDO
consultar_objeto_persona(Caso,Persona,Objeto) :-
    posee_objeto(Caso,Persona,Objeto).

% QUITAR OBJETO
quitar_objeto(Caso,Persona,Objeto) :-
    retractall(posee_objeto(Caso,Persona,Objeto)),
    guardar_motivos_medios.


% CREAR EVIDENCIA
crear_evidencia(Caso,Id,Tipo,Descripcion,Lugar) :-
    caso(Caso,_,_,_),
    \+ evidencia(Caso,Id,_,_,_),
    assertz(evidencia(Caso,Id,Tipo,Descripcion,Lugar)),
    guardar_evidencias.

% CONSULTAR EVIDENCIA
consultar_evidencia(Caso,Id,Tipo,Descripcion,Lugar) :-
    evidencia(Caso,Id,Tipo,Descripcion,Lugar).

% ACTUALIZAR EVIDENCIA
actualizar_evidencia(Caso,Id,Tipo,Descripcion,Lugar) :-
    caso(Caso,_,_,_),
    retract(evidencia(Caso,Id,_,_,_)),
    assertz(evidencia(Caso,Id,Tipo,Descripcion,Lugar)),
    guardar_evidencias.

% ELIMINAR EVIDENCIA
eliminar_evidencia(Caso,Id) :-
    retractall(evidencia(Caso,Id,_,_,_)),
    guardar_evidencias.

% GUARDAR EVIDENCIAS
guardar_evidencias :-
    ruta_archivo('data/evidencias_data.pl', RutaEv),
    open(RutaEv,write,Stream),
    write(Stream,'% DATOS DE EVIDENCIAS'), nl(Stream), nl(Stream),
    write(Stream,':- dynamic evidencia/5.'), nl(Stream), nl(Stream),
    forall(evidencia(Caso,Id,Tipo,Descripcion,Persona),
           escribir_evidencia(Stream,Caso,Id,Tipo,Descripcion,Persona)),
    close(Stream).

% ESCRIBIR EVIDENCIA
escribir_evidencia(Stream,Caso,Id,Tipo,Descripcion,Persona) :-
    writeq(Stream,evidencia(Caso,Id,Tipo,Descripcion,Persona)),
    write(Stream,'.'), nl(Stream).

% RELACIONAR EVIDENCIA CON PERSONA
relacionar_evidencia(Caso,Evidencia,Persona) :-
    persona(Caso,Persona,_,_),
    evidencia(Caso,Evidencia,_,_,_),
    \+ evidencia_relacionada(Caso,Evidencia,Persona),
    assertz(evidencia_relacionada(Caso,Evidencia,Persona)),
    guardar_relaciones_evidencia.

% CONSULTAR RELACION EVIDENCIA PERSONA
consultar_relacion_evidencia(Caso,Evidencia,Persona) :-
    evidencia_relacionada(Caso,Evidencia,Persona).

% ELIMINAR RELACION EVIDENCIA PERSONA
eliminar_relacion_evidencia(Caso,Evidencia,Persona) :-
    retractall(evidencia_relacionada(Caso,Evidencia,Persona)),
    guardar_relaciones_evidencia.

% GUARDAR RELACIONES DE EVIDENCIA
guardar_relaciones_evidencia :-
    ruta_archivo('data/evidencias_relaciones_data.pl', RutaRel),
    open(RutaRel,write,Stream),
    write(Stream,'% RELACIONES DE EVIDENCIAS - LOGIC DETECTIVE'), nl(Stream), nl(Stream),
    write(Stream,':- dynamic evidencia_relacionada/3.'), nl(Stream), nl(Stream),
    forall(evidencia_relacionada(Caso,Evidencia,Persona),
           escribir_relacion_evidencia(Stream,Caso,Evidencia,Persona)),
    close(Stream).

% ESCRIBIR RELACION DE EVIDENCIA
escribir_relacion_evidencia(Stream,Caso,Evidencia,Persona) :-
    writeq(Stream,evidencia_relacionada(Caso,Evidencia,Persona)),
    write(Stream,'.'), nl(Stream).


% CREAR DECLARACION
crear_declaracion(Caso,Id,Persona,Texto,Tipo) :-
    persona(Caso,Persona,_,_),
    \+ declaracion(Caso,Id,_,_,_),
    assertz(declaracion(Caso,Id,Persona,Texto,Tipo)),
    guardar_declaraciones.

% CONSULTAR DECLARACION
consultar_declaracion(Caso,Id,Persona,Texto,Tipo) :-
    declaracion(Caso,Id,Persona,Texto,Tipo).

% ACTUALIZAR DECLARACION
actualizar_declaracion(Caso,Id,Persona,Texto,Tipo) :-
    persona(Caso,Persona,_,_),
    retract(declaracion(Caso,Id,_,_,_)),
    assertz(declaracion(Caso,Id,Persona,Texto,Tipo)),
    guardar_declaraciones.

% ELIMINAR DECLARACION
eliminar_declaracion(Caso,Id) :-
    retractall(declaracion(Caso,Id,_,_,_)),
    guardar_declaraciones.

% GUARDAR DECLARACIONES
guardar_declaraciones :-
    ruta_archivo('data/declaraciones_data.pl', RutaDec),
    open(RutaDec,write,Stream),
    write(Stream,'% DECLARACIONES DATA - LOGIC DETECTIVE'), nl(Stream), nl(Stream),
    write(Stream,':- discontiguous declaracion/6.'), nl(Stream),
    write(Stream,':- discontiguous declaracion/5.'), nl(Stream),
    write(Stream,':- discontiguous registro_ubicacion_real/5.'), nl(Stream),
    write(Stream,':- discontiguous relacion_previa/4.'), nl(Stream), nl(Stream),
    write(Stream,':- dynamic declaracion/6.'), nl(Stream),
    write(Stream,':- dynamic declaracion/5.'), nl(Stream),
    write(Stream,':- dynamic registro_ubicacion_real/5.'), nl(Stream),
    write(Stream,':- dynamic relacion_previa/4.'), nl(Stream), nl(Stream),
    forall(declaracion(Caso,Id,Persona,Texto,Tipo),
           (writeq(Stream,declaracion(Caso,Id,Persona,Texto,Tipo)), write(Stream,'.'), nl(Stream))),
    nl(Stream),
    forall(declaracion(Caso,Persona,Afirmacion,H1,H2,Lugar),
           (writeq(Stream,declaracion(Caso,Persona,Afirmacion,H1,H2,Lugar)), write(Stream,'.'), nl(Stream))),
    nl(Stream),
    forall(registro_ubicacion_real(Caso,Persona,Hora,Lugar,Fuente),
           (writeq(Stream,registro_ubicacion_real(Caso,Persona,Hora,Lugar,Fuente)), write(Stream,'.'), nl(Stream))),
    nl(Stream),
    forall(relacion_previa(Caso,P1,P2,Rel),
           (writeq(Stream,relacion_previa(Caso,P1,P2,Rel)), write(Stream,'.'), nl(Stream))),
    close(Stream).