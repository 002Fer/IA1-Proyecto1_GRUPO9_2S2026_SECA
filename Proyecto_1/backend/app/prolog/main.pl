% Punto de entrada del motor Logic Detective.
% Carga conjunta de las responsabilidades de investigación y contradicciones.

:- consult('casos.pl').
:- consult('motivos_medios.pl').
:- consult('evidencias.pl').

% Responsabilidad 3: coartadas, testigos, cámaras, accesos,
% cronología, pistas, acusación y bitácora.
:- consult('data/investigacion_data.pl').
:- consult('inferencias.pl').
:- consult('reglas_investigacion.pl').

% Responsabilidad 4: declaraciones, contradicciones y cómplices.
:- consult('declaraciones_contradicciones.pl').
