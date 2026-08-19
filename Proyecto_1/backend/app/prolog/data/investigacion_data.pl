% LOGIC DETECTIVE - DATOS DE INVESTIGACION
% Hechos agrupados por predicado para mantener el archivo Prolog limpio.

% ===== lugar/3 =====
%% Hechos de lugar/3.
lugar('caso-1','pl-1','Sala 3 - Galeria Principal: Donde se exhibia la pintura. Encontrada sin la obra y con el marco vacio en el suelo.').
lugar('caso-1','pl-2','Sala de Restauracion: Taller privado de Elena. Contiene herramientas especializadas y materiales quimicos.').
lugar('caso-1','pl-3','Sala de Seguridad: Centro de monitoreo con acceso a todas las camaras. La grabacion fue manipulada.').
lugar('caso-1','pl-4','Estacionamiento Subterraneo: Acceso privado al edificio. Camaras no funcionales la noche del robo.').
lugar('caso-1','pl-5','Oficina del Director: Documentos financieros que revelan deudas. Comunicaciones sospechosas.').
lugar('caso-2','pl-b1','Laboratorio Principal: Donde el Dr. Montoya realizaba sus experimentos. Encontrado con equipos desconectados.').
lugar('caso-2','pl-b2','Sala de Servidores: Centro de datos. Los logs muestran accesos no autorizados la noche de la desaparicion.').
lugar('caso-2','pl-b3','Oficina de Viktor: Consultoria temporal. Se encontraron documentos de la empresa rival.').
lugar('caso-2','pl-b4','Aparcamiento del edificio: Camaras muestran el vehiculo de Viktor a las 22:15.').
lugar('caso-2','pl-b5','Despacho del Dr. Montoya: Su ordenador muestra actividad sospechosa a las 23:00.').
lugar('caso-3','pl-c1','Suite VIP 501: Suite de la condesa. La caja fuerte fue encontrada abierta y vacia.').
lugar('caso-3','pl-c2','Salon de Gala: Donde se celebraba el evento. La mayoria de sospechosos estaban aqui.').
lugar('caso-3','pl-c3','Cuarto de Conserjes: Oficina de Maximilian. Se encontraron documentos sobre seguros de joyas.').
lugar('caso-3','pl-c4','Ascensor Privado VIP: Acceso exclusivo al piso 5. Los registros muestran el movimiento de Maximilian.').
lugar('caso-3','pl-c5','Recepcion del Hotel: Centro de operaciones. Logs de llaves maestras almacenados aqui.').

% ===== coartada/5 =====
%% Hechos de coartada/5.
coartada('caso-1','suspect-1','Afirma haber estado en una cena oficial hasta las 23:00',true,coartada_registrada).
coartada('caso-1','suspect-2','Dice haber trabajado hasta tarde en su taller privado',false,coartada_registrada).
coartada('caso-1','suspect-3','Fue drogado segun informe medico',true,coartada_registrada).
coartada('caso-1','suspect-4','Afirma haber estado enferma en casa',false,coartada_registrada).
coartada('caso-2','suspect-b1','Afirma haber estado en congreso internacional en otra ciudad',true,coartada_registrada).
coartada('caso-2','suspect-b2','Reuniones corporativas documentadas ese dia',true,coartada_registrada).
coartada('caso-2','suspect-b3','Dice haber estado trabajando desde casa',false,coartada_registrada).
coartada('caso-2','suspect-b4','Afirma haber salido temprano ese dia por enfermedad',false,coartada_registrada).
coartada('caso-3','suspect-c1','Afirma haber coordinado el evento desde el lobby toda la noche',false,coartada_registrada).
coartada('caso-3','suspect-c2','Afirma haber estado sirviendo en el salon de gala',true,coartada_registrada).
coartada('caso-3','suspect-c3','Estaba en la gala con decenas de testigos',true,coartada_registrada).
coartada('caso-3','suspect-c4','Acompano a la condesa en la gala toda la noche',false,coartada_registrada).

% ===== testimonio/4 =====
%% Hechos de testimonio/4.
testimonio('caso-1','suspect-1','Estaba en la cena del alcalde hasta las 23:00, hay testigos.',declaracion_sospechoso).
testimonio('caso-1','suspect-1','La pintura fue revisada a las 18:00 y estaba en perfectas condiciones.',declaracion_sospechoso).
testimonio('caso-1','suspect-1','No conozco a ningun coleccionista que pagaria por esa obra.',declaracion_sospechoso).
testimonio('caso-1','suspect-2','Trabaje en mi taller toda la noche, pero estaba sola.',declaracion_sospechoso).
testimonio('caso-1','suspect-2','Esa pintura tenia un defecto oculto que solo yo conozco.',declaracion_sospechoso).
testimonio('caso-1','suspect-2','No tengo ninguna razon para robarla.',declaracion_sospechoso).
testimonio('caso-1','suspect-3','Lo ultimo que recuerdo es haber tomado mi cafe de las 22:00.',declaracion_sospechoso).
testimonio('caso-1','suspect-3','Vi a alguien con abrigo oscuro cerca de la sala 3 antes de desmayarme.',declaracion_sospechoso).
testimonio('caso-1','suspect-3','Nunca dejaria que robaran el museo.',declaracion_sospechoso).
testimonio('caso-1','suspect-4','Estaba enferma, mi medico puede confirmarlo... aunque no lo llame esa noche.',declaracion_sospechoso).
testimonio('caso-1','suspect-4','Esa pintura vale 3 millones. Cualquiera con contactos la venderia.',declaracion_sospechoso).
testimonio('caso-1','suspect-4','Marco siempre ha sido corrupto. Quizas el mismo la robo.',declaracion_sospechoso).
testimonio('caso-2','suspect-b1','Estaba en el Congreso de Biotecnologia. Hay cientos de testigos.',declaracion_sospechoso).
testimonio('caso-2','suspect-b1','Sergio era mi mejor amigo, jamas le haria dano.',declaracion_sospechoso).
testimonio('caso-2','suspect-b1','Creo que la empresa rival esta detras de esto.',declaracion_sospechoso).
testimonio('caso-2','suspect-b2','Mis reuniones estan en el calendario corporativo.',declaracion_sospechoso).
testimonio('caso-2','suspect-b2','La desaparicion de Sergio es una perdida enorme.',declaracion_sospechoso).
testimonio('caso-2','suspect-b2','Las formulas pertenecen a la empresa, no a el.',declaracion_sospechoso).
testimonio('caso-2','suspect-b3','Trabajo desde casa ese dia, nadie puede confirmarlo.',declaracion_sospechoso).
testimonio('caso-2','suspect-b3','Solo soy un consultor, no tengo interes en la formula.',declaracion_sospechoso).
testimonio('caso-2','suspect-b3','Sergio y yo eramos cordiales, nada mas.',declaracion_sospechoso).
testimonio('caso-2','suspect-b4','Me fui a las 14:00 por migraña, el Dr. Montoya me lo autorizo.',declaracion_sospechoso).
testimonio('caso-2','suspect-b4','Vi a Viktor revisando los archivos del Dr. sin permiso la semana pasada.',declaracion_sospechoso).
testimonio('caso-2','suspect-b4','Jamas venderia informacion confidencial.',declaracion_sospechoso).
testimonio('caso-3','suspect-c1','Estuve en el lobby toda la noche coordinando el evento.',declaracion_sospechoso).
testimonio('caso-3','suspect-c1','Nunca subi a las suites durante la gala.',declaracion_sospechoso).
testimonio('caso-3','suspect-c1','La condesa es nuestra cliente mas importante, la respeto.',declaracion_sospechoso).
testimonio('caso-3','suspect-c2','Servi en el salon toda la noche, los meseros pueden confirmarlo.',declaracion_sospechoso).
testimonio('caso-3','suspect-c2','Limpie la suite a las 15:00 y el collar estaba sobre el tocador.',declaracion_sospechoso).
testimonio('caso-3','suspect-c2','Vi a Maximilian subir con el ascensor privado a las 21:30.',declaracion_sospechoso).
testimonio('caso-3','suspect-c3','Estuve en la gala hasta la medianoche, soy un invitado VIP.',declaracion_sospechoso).
testimonio('caso-3','suspect-c3','Conozco el valor del collar, pero jamas lo robaria.',declaracion_sospechoso).
testimonio('caso-3','suspect-c3','Quizas fue alguien del personal del hotel.',declaracion_sospechoso).
testimonio('caso-3','suspect-c4','Acompane a la condesa en todo momento durante la gala.',declaracion_sospechoso).
testimonio('caso-3','suspect-c4','El collar fue guardado en la caja fuerte antes de bajar.',declaracion_sospechoso).
testimonio('caso-3','suspect-c4','Maximilian me parecio nervioso durante toda la noche.',declaracion_sospechoso).

% ===== contradiccion/4 =====
%% Hechos de contradiccion/4.
contradiccion('caso-1','Elena afirma haber salido a las 19:45','Camara exterior la muestra regresando a las 21:30','suspect-2').
contradiccion('caso-1','Carmen dice estar enferma en casa toda la noche','Recibo de farmacia con su descripcion fisica comprado a las 22:00','suspect-4').
contradiccion('caso-2','Viktor dice estar en casa toda la noche','Camara del aparcamiento lo muestra en el edificio a las 22:15','suspect-b3').
contradiccion('caso-2','Isabel dice que se fue a las 14:00 y no regreso','Logs del servidor muestran acceso con sus credenciales a las 20:00','suspect-b4').
contradiccion('caso-3','Maximilian dice haber estado en el lobby toda la noche','Log del ascensor lo muestra en el piso 5 a las 21:28','suspect-c1').
contradiccion('caso-3','Natasha dice haber acompanado a la condesa en todo momento','La condesa afirma que Natasha se ausentó 15 minutos durante la gala','suspect-c4').

% ===== linea_tiempo/4 =====
%% Hechos de linea_tiempo/4.
linea_tiempo('caso-1','17:30','Museo cierra al publico. Personal autorizado permanece.',false).
linea_tiempo('caso-1','18:00','Director Marco Villanueva revisa la pintura y confirma que esta en su lugar.',false).
linea_tiempo('caso-1','19:45','Elena Rios firma la bitacora de salida del museo.',true).
linea_tiempo('caso-1','21:00','Guardia Roberto Peña inicia su ronda nocturna.',false).
linea_tiempo('caso-1','22:00','Roberto toma su cafe de las 10 pm en la sala de descanso.',true).
linea_tiempo('caso-1','22:15','Las camaras de la Sala 3 son desactivadas remotamente.',true).
linea_tiempo('caso-1','22:30','Roberto es encontrado inconsciente por otro guardia.',true).
linea_tiempo('caso-1','23:00','Vehiculo desconocido visto frente al museo (declaracion de testigo).',true).
linea_tiempo('caso-1','23:45','Sistema de camaras se reactiva automaticamente.',false).
linea_tiempo('caso-1','06:00','Personal de limpieza descubre el robo y llama a la policia.',false).
linea_tiempo('caso-2','08:00','Dr. Montoya llega al laboratorio y trabaja normalmente.',false).
linea_tiempo('caso-2','14:00','Isabel se retira del laboratorio por enfermedad.',false).
linea_tiempo('caso-2','17:30','Personal administrativo abandona el edificio.',false).
linea_tiempo('caso-2','19:00','Viktor es visto saliendo del edificio. Afirma irse a casa.',true).
linea_tiempo('caso-2','21:45','Camaras del aparcamiento registran el vehiculo de Viktor.',true).
linea_tiempo('caso-2','22:30','Guardia ve a Viktor en el pasillo del laboratorio.',true).
linea_tiempo('caso-2','23:15','Archivos de la formula son copiados en USB externo.',true).
linea_tiempo('caso-2','23:45','Dr. Montoya no responde llamadas. Ultima senal de su movil.',true).
linea_tiempo('caso-2','07:00','Colega descubre el laboratorio vacio y llama a autoridades.',false).
linea_tiempo('caso-2','08:30','Policia inicia investigacion. Viktor no aparece a trabajar.',true).
linea_tiempo('caso-3','15:00','Sofia limpia la suite. El collar esta visible sobre el tocador.',false).
linea_tiempo('caso-3','18:00','La condesa guarda el collar en la caja fuerte antes de la gala.',false).
linea_tiempo('caso-3','19:00','La gala comienza. Todos los sospechosos bajan al salon.',false).
linea_tiempo('caso-3','20:30','Maximilian recibe una llamada anonima de 3 minutos.',true).
linea_tiempo('caso-3','21:28','Ascensor privado registra subida de Maximilian al piso 5.',true).
linea_tiempo('caso-3','21:35','Log del sistema registra apertura de caja fuerte con llave maestra.',true).
linea_tiempo('caso-3','21:42','Maximilian regresa al lobby. Sofia lo ve llegar.',true).
linea_tiempo('caso-3','23:00','La condesa sube a su suite y descubre el robo.',false).
linea_tiempo('caso-3','23:05','Se activa la alarma del hotel y se alerta a la policia.',false).
linea_tiempo('caso-3','23:30','Policia interroga a todos los presentes. Maximilian parece nervioso.',true).

% ===== testigo/5 =====
%% Hechos de testigo/5.
testigo('caso-1','testigo_cena_alcalde','Testigos de la cena oficial del alcalde','verifica','suspect-1').
testigo('caso-1','testigo_vehiculo','Testigo exterior','observa vehiculo desconocido a las 23:00','suspect-2').
testigo('caso-1','guardia_museo','Otro guardia del museo','encuentra inconsciente a Roberto a las 22:30','suspect-3').
testigo('caso-2','guardia_laboratorio','Guardia del laboratorio','observa a Viktor en el edificio a las 22:30','suspect-b3').
testigo('caso-2','isabel_fuentes','Isabel Mora','observa a Viktor revisar archivos sin autorizacion','suspect-b3').
testigo('caso-2','registro_servidor','Sistema de registros','detecta acceso con credenciales de Isabel a las 20:00','suspect-b4').
testigo('caso-3','sofia_renn','Sofia Renn','es observada por bartender en el salon durante la gala','suspect-c2').
testigo('caso-3','bartender_gala','Bartender del evento','confirma presencia de Sofia en el salon toda la noche','suspect-c2').
testigo('caso-3','sofia_camarera','Sofia como testigo presencial','observa a Maximilian subir por ascensor privado','suspect-c1').
testigo('caso-3','condesa','Condesa propietaria del collar','indica ausencia de Natasha durante 15 minutos','suspect-c4').

% ===== camara/6 =====
%% Hechos de camara/6.
camara('caso-1','camara_sala3','Sala 3 - Galeria Principal','22:15','23:45','Desactivacion remota y reactivacion automatica').
camara('caso-1','camara_exterior','Calle exterior','21:30','21:30','Registra regreso de Elena').
camara('caso-2','camara_aparcamiento','Aparcamiento','21:45','21:45','Vehiculo de Viktor registrado').
camara('caso-2','camara_pasillo','Pasillo del laboratorio','22:30','22:30','Viktor aparece en el pasillo').
camara('caso-3','camara_ascensor','Ascensor privado','21:28','21:28','Maximilian sube al piso VIP').
camara('caso-3','camara_lobby','Lobby','21:42','21:42','Maximilian regresa al lobby').

% ===== registro_acceso/6 =====
%% Hechos de registro_acceso/6.
registro_acceso('caso-1','suspect-2','Sala 3 - Galeria Principal','22:15','camara_sala3','ingreso_compatible_con_evidencia').
registro_acceso('caso-1','suspect-2','Museo','21:30','camara_exterior','regreso_detectado').
registro_acceso('caso-1','suspect-4','Farmacia cercana al museo','22:00','recibo_farmacia','presencia_detectada').
registro_acceso('caso-2','suspect-b3','Edificio del laboratorio','22:30','guardia_laboratorio','presencia_detectada').
registro_acceso('caso-2','suspect-b3','Sala de servidores','23:15','registro_servidor','copia_de_formula').
registro_acceso('caso-2','suspect-b4','Servidor','20:00','logs_servidor','acceso_con_credenciales').
registro_acceso('caso-3','suspect-c1','Piso VIP 5','21:28','camara_ascensor','subida_registrada').
registro_acceso('caso-3','suspect-c1','Caja fuerte Suite VIP 501','21:35','registro_acceso_hotel','apertura_con_llave_maestra').
registro_acceso('caso-3','suspect-c4','Gala','tiempo_no_determinado','condesa','ausencia_reportada').

% ===== perfil/5 =====
%% Hechos de perfil/5.
perfil('caso-1','suspect-1',45,'Director del Museo','Director del museo desde hace 10 anos. Conoce cada rincon del edificio.').
perfil('caso-1','suspect-2',32,'Restauradora de Arte','Experta en restauracion. Tuvo acceso a la pintura dos semanas antes del robo.').
perfil('caso-1','suspect-3',28,'Guardia de Seguridad','Guardia nocturno. Fue encontrado inconsciente junto a la sala principal.').
perfil('caso-1','suspect-4',55,'Curadora Principal','Curadora con 25 anos de experiencia. Tenia conflictos con la direccion.').
perfil('caso-2','suspect-b1',38,'Investigadora Senior','Colega cercana del Dr. Montoya. Trabajaron juntos 5 anos.').
perfil('caso-2','suspect-b2',52,'Director de I+D','Superior directo del cientifico. Presionaba por resultados rapidos.').
perfil('caso-2','suspect-b3',44,'Consultor Externo','Consultor contratado hace 3 meses. Tiene vinculaciones con empresas competidoras.').
perfil('caso-2','suspect-b4',26,'Asistente de Laboratorio','Joven asistente con deudas estudiantiles. Tenia acceso a los archivos del cientifico.').
perfil('caso-3','suspect-c1',41,'Jefe de Conserjes','Responsable de todos los servicios VIP del hotel. Conoce cada suite y protocolo.').
perfil('caso-3','suspect-c2',29,'Camarera de Suite VIP','Encargada de atender personalmente a la condesa durante su estancia.').
perfil('caso-3','suspect-c3',58,'Invitado - Anticuario','Comerciante de joyas de lujo con reputacion cuestionable en el mercado negro.').
perfil('caso-3','suspect-c4',35,'Asistente Personal de la Condesa','Asistente de confianza. Unica persona ademas de la condesa con acceso directo al collar.').

