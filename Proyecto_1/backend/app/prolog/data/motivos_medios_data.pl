% DATOS DE MOTIVOS Y MEDIOS

:- dynamic motivo/3.
:- dynamic herramienta/3.
:- dynamic posee_herramienta/3.
:- dynamic objeto/3.
:- dynamic posee_objeto/3.
:- dynamic conocimiento/3.

% MOTIVOS

% CASO 1
motivo('caso-1', 'suspect-1', deudas_economicas).
motivo('caso-1', 'suspect-2', contactos_mercado_negro).
motivo('caso-1', 'suspect-3', ninguno_identificado).
motivo('caso-1', 'suspect-4', venganza_contra_director).

% CASO 2
motivo('caso-2', 'suspect-b1', credito_investigacion).
motivo('caso-2', 'suspect-b2', presion_por_patentes).
motivo('caso-2', 'suspect-b3', espionaje_industrial).
motivo('caso-2', 'suspect-b4', oferta_economica).

% CASO 3
motivo('caso-3', 'suspect-c1', deudas_de_juego).
motivo('caso-3', 'suspect-c2', ninguno_claro).
motivo('caso-3', 'suspect-c3', valor_del_collar).
motivo('caso-3', 'suspect-c4', disputa_por_herencia).

% HERRAMIENTAS / MEDIOS DISPONIBLES

% CASO 1
herramienta('caso-1', llaves_maestras, acceso).
herramienta('caso-1', sistema_camaras, digital).
herramienta('caso-1', sistema_alarmas, digital).

% CASO 2
herramienta('caso-2', acceso_laboratorio, acceso).
herramienta('caso-2', credenciales_servidor, digital).
herramienta('caso-2', sistema_informatico, digital).

% CASO 3
herramienta('caso-3', llave_maestra_suite, acceso).
herramienta('caso-3', acceso_ascensor_privado, acceso).
herramienta('caso-3', combinacion_caja_fuerte, seguridad).

% HERRAMIENTAS QUE POSEE CADA PERSONA

% CASO 1
posee_herramienta('caso-1', 'suspect-1', llaves_maestras).
posee_herramienta('caso-1', 'suspect-3', sistema_camaras).
posee_herramienta('caso-1', 'suspect-2', sistema_alarmas).

% CASO 2
posee_herramienta('caso-2', 'suspect-b1', acceso_laboratorio).
posee_herramienta('caso-2', 'suspect-b2', acceso_laboratorio).
posee_herramienta('caso-2', 'suspect-b3', acceso_laboratorio).
posee_herramienta('caso-2', 'suspect-b3', credenciales_servidor).
posee_herramienta('caso-2', 'suspect-b4', credenciales_servidor).

% CASO 3
posee_herramienta('caso-3', 'suspect-c1', llave_maestra_suite).
posee_herramienta('caso-3', 'suspect-c1', acceso_ascensor_privado).
posee_herramienta('caso-3', 'suspect-c4', combinacion_caja_fuerte).

% OBJETOS / ELEMENTOS RELACIONADOS CON EL CASO

% CASO 1
objeto('caso-1', pintura_siglo_xviii, obra_arte).

% CASO 2
objeto('caso-2', formula_biotecnologica, informacion).

% CASO 3
objeto('caso-3', collar_diamantes, joya).


% CONOCIMIENTOS DE CADA PERSONA

% CASO 1
conocimiento('caso-1', 'suspect-1', llaves_museo).
conocimiento('caso-1', 'suspect-2', sistema_alarmas).
conocimiento('caso-1', 'suspect-2', sistema_camaras).
conocimiento('caso-1', 'suspect-3', sistema_camaras).
conocimiento('caso-1', 'suspect-4', horarios_personal).

% CASO 2
conocimiento('caso-2', 'suspect-b1', procedimientos_laboratorio).
conocimiento('caso-2', 'suspect-b2', acceso_laboratorio).
conocimiento('caso-2', 'suspect-b3', sistema_informatico).
conocimiento('caso-2', 'suspect-b3', procedimientos_laboratorio).
conocimiento('caso-2', 'suspect-b4', codigos_servidor).

% CASO 3
conocimiento('caso-3', 'suspect-c1', protocolos_hotel).
conocimiento('caso-3', 'suspect-c1', turnos_seguridad).
conocimiento('caso-3', 'suspect-c4', combinacion_caja_fuerte).