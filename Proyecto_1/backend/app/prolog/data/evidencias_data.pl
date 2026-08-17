% EVIDENCIAS - LOGIC DETECTIVE
:- dynamic evidencia/5.
:- dynamic evidencia_relacionada/3.

% CASO 1 - ASESINATO EN EL MUSEO
% evidencia(Caso, IdEvidencia, Tipo, Descripcion, Lugar)
evidencia('caso-1','ev-1',fisica,'Huellas dactilares parciales en el marco vacio','Sala 3 - Galeria Principal').
evidencia('caso-1','ev-2',quimica,'Residuos de somnifero en la taza de cafe del guardia','Sala de descanso').
evidencia('caso-1','ev-3',digital,'Camara de seguridad desactivada entre 22:15 y 23:45','Sistema central').
evidencia('caso-1','ev-4',testimonial,'Testigo vio un vehiculo desconocido frente al museo a las 23:00','Calle exterior').
evidencia('caso-1','ev-5',documental,'Correo electronico encontrado citando cifra exacta de la pintura','Servidor del museo').
evidencia('caso-1','ev-6',fisica,'Guante negro de latex encontrado en escalera de emergencia','Escalera B').
evidencia('caso-1','ev-7',digital,'Busqueda web sobre exportar obras de arte en el ordenador de Elena','Oficina de restauracion').
evidencia('caso-1','ev-8',fisica,'Marcas de herramientas en el sistema de alarma','Panel de control - Sala 3').
evidencia('caso-1','ev-9',documental,'Recibo de compra de somnifero a nombre desconocido','Farmacia cercana al museo').
evidencia('caso-1','ev-10',testimonial,'Empleado vio a Elena discutir con el director tres dias antes','Pasillo administrativo').

% CASO 2 - EL CIENTIFICO DESAPARECIDO
evidencia('caso-2','ev-b1',digital,'Archivos de la formula copiados en USB externo a las 23:15','Servidor del laboratorio').
evidencia('caso-2','ev-b2',fisica,'Pluma con logo de empresa rival encontrada en laboratorio','Mesa de trabajo del Dr. Montoya').
evidencia('caso-2','ev-b3',digital,'Llamadas frecuentes a numero de empresa competidora desde celular de Viktor','Registros telefonicos').
evidencia('caso-2','ev-b4',testimonial,'Guardia vio a Viktor en el edificio a las 22:30','Entrada principal').
evidencia('caso-2','ev-b5',documental,'Transferencia bancaria anonima de 50000 dolares recibida por cuenta vinculada a Viktor','Registros financieros').
evidencia('caso-2','ev-b6',digital,'Acceso al servidor con credenciales del Dr. Montoya desde IP externa','Logs del servidor').
evidencia('caso-2','ev-b7',fisica,'Nota de renuncia del Dr. Montoya con letra forzada segun grafologo','Oficina del director').
evidencia('caso-2','ev-b8',testimonial,'Isabel vio a Viktor revisar archivos sin autorizacion','Laboratorio principal').
evidencia('caso-2','ev-b9',documental,'Contrato de Viktor con clausulas de confidencialidad violadas','Recursos Humanos').
evidencia('caso-2','ev-b10',digital,'Correos encriptados enviados desde laboratorio a dominio de empresa rival','Servidor de correo corporativo').

% CASO 3 - EL GRAN HOTEL
evidencia('caso-3','ev-c1',digital,'Registro del ascensor privado: Maximilian sube a piso VIP a las 21:28','Sistema de control del hotel').
evidencia('caso-3','ev-c2',fisica,'Fibra de guante de seda encontrada en la caja fuerte abierta','Suite VIP 501').
evidencia('caso-3','ev-c3',digital,'La llave maestra de Maximilian abre la caja fuerte segun log del sistema','Registro de accesos del hotel').
evidencia('caso-3','ev-c4',testimonial,'Camarera Sofia vio a Maximilian subir en ascensor privado a las 21:30','Pasillo del lobby').
evidencia('caso-3','ev-c5',documental,'Deudas de juego de Maximilian por valor de 180000 dolares con prestamistas','Registros financieros privados').
evidencia('caso-3','ev-c6',digital,'Llamada anonima recibida por Maximilian 2 horas antes del robo','Registros telefonicos del hotel').
evidencia('caso-3','ev-c7',fisica,'Caja fuerte fue abierta sin signos de fuerza: requiere codigo o llave maestra','Suite VIP 501').
evidencia('caso-3','ev-c8',testimonial,'Bartender del evento confirma que Sofia estuvo en el salon toda la noche','Salon de gala').
evidencia('caso-3','ev-c9',documental,'Seguro del collar fue revisado por Maximilian una semana antes','Archivo de seguros del hotel').
evidencia('caso-3','ev-c10',digital,'Busqueda en telefono de Maximilian: compradores de joyas y precios de diamantes','Telefono confiscado').

% CASO 1 - ASESINATO EN EL MUSEO
evidencia_relacionada('caso-1','ev-1','suspect-2').
evidencia_relacionada('caso-1','ev-2','suspect-2').
evidencia_relacionada('caso-1','ev-2','suspect-4').
evidencia_relacionada('caso-1','ev-3','suspect-2').
evidencia_relacionada('caso-1','ev-4','suspect-2').
evidencia_relacionada('caso-1','ev-4','suspect-4').
evidencia_relacionada('caso-1','ev-5','suspect-2').
evidencia_relacionada('caso-1','ev-6','suspect-2').
evidencia_relacionada('caso-1','ev-7','suspect-2').
evidencia_relacionada('caso-1','ev-8','suspect-2').
evidencia_relacionada('caso-1','ev-9','suspect-2').
evidencia_relacionada('caso-1','ev-9','suspect-4').
evidencia_relacionada('caso-1','ev-10','suspect-2').
evidencia_relacionada('caso-1','ev-10','suspect-1').

% CASO 2 - EL CIENTIFICO DESAPARECIDO
evidencia_relacionada('caso-2','ev-b1','suspect-b3').
evidencia_relacionada('caso-2','ev-b2','suspect-b3').
evidencia_relacionada('caso-2','ev-b3','suspect-b3').
evidencia_relacionada('caso-2','ev-b4','suspect-b3').
evidencia_relacionada('caso-2','ev-b5','suspect-b3').
evidencia_relacionada('caso-2','ev-b6','suspect-b3').
evidencia_relacionada('caso-2','ev-b6','suspect-b4').
evidencia_relacionada('caso-2','ev-b7','suspect-b3').
evidencia_relacionada('caso-2','ev-b8','suspect-b3').
evidencia_relacionada('caso-2','ev-b9','suspect-b3').
evidencia_relacionada('caso-2','ev-b10','suspect-b3').

% CASO 3 - EL GRAN HOTEL
evidencia_relacionada('caso-3','ev-c1','suspect-c1').
evidencia_relacionada('caso-3','ev-c2','suspect-c1').
evidencia_relacionada('caso-3','ev-c3','suspect-c1').
evidencia_relacionada('caso-3','ev-c4','suspect-c1').
evidencia_relacionada('caso-3','ev-c5','suspect-c1').
evidencia_relacionada('caso-3','ev-c6','suspect-c1').
evidencia_relacionada('caso-3','ev-c7','suspect-c1').
evidencia_relacionada('caso-3','ev-c7','suspect-c4').
evidencia_relacionada('caso-3','ev-c8','suspect-c2').
evidencia_relacionada('caso-3','ev-c9','suspect-c1').
evidencia_relacionada('caso-3','ev-c10','suspect-c1').