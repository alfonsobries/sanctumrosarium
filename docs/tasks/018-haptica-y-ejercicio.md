# Task 018 - Háptica y sesión de ejercicio

## Objetivo

Rezar corriendo: un toque por cuenta, la app viva durante todo el Rosario, y el ejercicio
registrado si el usuario quiere.

## Dependencias

- Task 016, 017

## Decisiones tomadas (primera pasada, agosto 2026)

- Patrones del sistema, distintos al tacto: Padrenuestro `notification`, Ave `click`,
  Gloria `success`, misterio `start`. Un toque por cuenta, nunca continuo (interrumpe el
  pulso).
- Sesión de ejercicio / HealthKit y el registro de la caminata: siguiente pasada. Piden
  permiso en el reloj y medición de batería en aparato. Sin eso no se escribe nada en
  Salud.
- Si no hay audio, la háptica es el avance.

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] ~~App - n/a~~
- [x] Reloj - háptica por cuenta
- [x] Audio - coordinada con el aviso de auriculares
- [x] Accesibilidad - la háptica es la vía sin mirar
- [x] ~~Sitio - n/a~~
