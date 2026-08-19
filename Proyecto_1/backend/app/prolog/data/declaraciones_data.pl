% DECLARACIONES DATA - LOGIC DETECTIVE

:- discontiguous declaracion/6.
:- discontiguous registro_ubicacion_real/5.
:- discontiguous relacion_previa/4.

:- dynamic declaracion/6.
:- dynamic registro_ubicacion_real/5.
:- dynamic relacion_previa/4.

% ==================== CASO 1: Asesinato en el Museo ====================
% declaracion(Caso, Persona, Afirmacion, HoraInicio, HoraFin, LugarAfirmado)

declaracion('caso-1', 'suspect-1', 'Estaba en la cena del alcalde hasta las 23:00', '19:00', '23:00', 'cena_alcalde').
declaracion('caso-1', 'suspect-1', 'La pintura fue revisada a las 18:00 y estaba intacta', '18:00', '18:00', 'sala_3').

declaracion('caso-1', 'suspect-2', 'Trabaje en mi taller privado toda la noche', '19:45', '06:00', 'taller_privado').
declaracion('caso-1', 'suspect-2', 'No estuve en el museo ni en sus alrededores de noche', '20:00', '23:59', 'fuera_museo').

declaracion('caso-1', 'suspect-3', 'Tome mi cafe a las 22:00 y luego me desmaye', '22:00', '22:30', 'sala_descanso').
declaracion('caso-1', 'suspect-3', 'Vi a alguien con abrigo oscuro cerca de la sala 3', '21:55', '22:00', 'sala_3').

declaracion('caso-1', 'suspect-4', 'Estaba enferma en casa toda la noche sin salir', '20:00', '06:00', 'casa').

% Registro de ubicaciones reales (Evidencias/Camaras/Logs)
% registro_ubicacion_real(Caso, Persona, Hora, LugarReal, Fuente)
registro_ubicacion_real('caso-1', 'suspect-2', '21:30', 'Sala 3 - Galeria Principal', 'camara_exterior').
registro_ubicacion_real('caso-1', 'suspect-2', '22:15', 'Sala 3 - Galeria Principal', 'huella_y_log_alarma').
registro_ubicacion_real('caso-1', 'suspect-4', '22:00', 'Farmacia cercana al museo', 'recibo_compra').

% Relaciones entre personas
% relacion_previa(Caso, Persona1, Persona2, TipoRelacion)
relacion_previa('caso-1', 'suspect-2', 'suspect-4', 'contacto_mercado_negro').
relacion_previa('caso-1', 'suspect-2', 'suspect-1', 'disputa_laboral').


% ==================== CASO 2: El Cientifico Desaparecido ====================

declaracion('caso-2', 'suspect-b1', 'Estaba en el Congreso de Biotecnologia en otra ciudad', '08:00', '23:59', 'otra_ciudad').
declaracion('caso-2', 'suspect-b2', 'Estuve en reuniones corporativas documentadas todo el dia', '08:00', '20:00', 'sala_junta').

declaracion('caso-2', 'suspect-b3', 'Trabaje desde mi casa toda la noche sin salir', '19:00', '06:00', 'casa').
declaracion('caso-2', 'suspect-b3', 'No tengo interes ni contacto con empresas rivales', '00:00', '23:59', 'ninguno').

declaracion('caso-2', 'suspect-b4', 'Me fui a las 14:00 por migrana y no regrese al laboratorio', '14:00', '23:59', 'casa').
declaracion('caso-2', 'suspect-b4', 'Vi a Viktor revisando archivos del Dr. Montoya sin permiso', '13:00', '14:00', 'laboratorio').

% Registros reales caso 2
registro_ubicacion_real('caso-2', 'suspect-b3', '22:15', 'Mesa de trabajo del Dr. Montoya', 'camara_aparcamiento').
registro_ubicacion_real('caso-2', 'suspect-b3', '22:30', 'Entrada principal', 'testimonio_guardia').
registro_ubicacion_real('caso-2', 'suspect-b4', '20:00', 'Logs del servidor', 'log_credenciales').

relacion_previa('caso-2', 'suspect-b3', 'suspect-b4', 'oferta_dinero').


% ==================== CASO 3: El Gran Hotel ====================

declaracion('caso-3', 'suspect-c1', 'Estuve en el lobby coordinando el evento toda la noche', '19:00', '02:00', 'lobby').
declaracion('caso-3', 'suspect-c1', 'Nunca subi a las suites durante la gala', '19:00', '02:00', 'piso_vip').

declaracion('caso-3', 'suspect-c2', 'Servi en el salon de gala toda la noche', '19:00', '01:00', 'salon_gala').
declaracion('caso-3', 'suspect-c2', 'Vi a Maximilian subir en el ascensor privado a las 21:30', '21:30', '21:30', 'lobby').

declaracion('caso-3', 'suspect-c3', 'Estuve en la gala celebrando hasta la medianoche', '19:00', '00:00', 'salon_gala').

declaracion('caso-3', 'suspect-c4', 'Acompane a la condesa en todo momento durante la gala', '19:00', '23:00', 'salon_gala').

% Registros reales caso 3
registro_ubicacion_real('caso-3', 'suspect-c1', '21:28', 'Sistema de control del hotel', 'log_ascensor').
registro_ubicacion_real('caso-3', 'suspect-c1', '21:35', 'Suite VIP 501', 'log_llave_maestra').
registro_ubicacion_real('caso-3', 'suspect-c4', '21:25', 'pasillo_exterior', 'testimonio_condesa').

relacion_previa('caso-3', 'suspect-c1', 'suspect-c4', 'acuerdo_caja_fuerte').
