% CASOS - LOGIC DETECTIVE

:- dynamic caso/4.
:- dynamic persona/4.

% CASOS

caso(
    'caso-1',
    'Asesinato en el Museo',
    'Una valiosa pintura del siglo XVIII ha desaparecido del Museo Nacional de Arte durante la noche.',
    facil
).

caso(
    'caso-2',
    'El Cientifico Desaparecido',
    'El Dr. Sergio Montoya ha desaparecido dejando su laboratorio en caos.',
    medio
).

caso(
    'caso-3',
    'El Gran Hotel',
    'Un collar de diamantes valorado en 2 millones ha desaparecido durante una gala.',
    dificil
).


% PERSONAS

persona('caso-1','suspect-1','Marco Villanueva',sospechoso).

persona('caso-1','suspect-2','Elena Rios',sospechoso).

persona('caso-1','suspect-3','Roberto Pena',sospechoso).

persona('caso-1','suspect-4','Carmen Lozano',sospechoso).


persona('caso-2','suspect-b1','Lucia Fuentes',sospechoso).

persona('caso-2','suspect-b2','Andres Castillo',sospechoso).

persona('caso-2','suspect-b3','Viktor Sorokin',sospechoso).

persona('caso-2','suspect-b4','Isabel Mora',sospechoso).


persona('caso-3','suspect-c1','Maximilian Dreer',sospechoso).

persona('caso-3','suspect-c2','Sofia Renn',sospechoso).

persona('caso-3','suspect-c3','Philippe Laurent',sospechoso).

persona('caso-3','suspect-c4','Natasha Voronova',sospechoso).