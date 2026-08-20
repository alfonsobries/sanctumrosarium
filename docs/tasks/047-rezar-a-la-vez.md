# Task 047 - Rezar a la vez

## Objetivo

Saber que otros están rezando ahora, y poder rezar a la misma hora, sin nombres, sin chat
y sin ranking.

## Dependencias

- Task 013

## Contexto

Contemplatio tiene un contador comunitario. Orabimus sincroniza por la red. Es la única
feature del mapa que pide un servidor, y choca con la decisión 4 (empezar sin backend) y
con la regla de que lo rezado no sale del dispositivo.

Por eso esta task es la última. Si se hace, el servidor ve un pulso anónimo ("alguien
empezó", "alguien terminó"), no un diario. Sin cuentas.

## Qué construir

### 1. El número

"Hay gente rezando ahora". Un entero, o un tramo ("varios", "muchos") si el número bajo se
ve triste. Nunca una tabla.

### 2. La hora común

Un momento del día, al estilo del Ángelus, en el que quien quiera se suma. No es una sala.
No hay audio compartido obligatorio.

### 3. Misterio del día compartido

El mismo ciclo que ya calcula el motor, visible como "hoy la gente reza los gozosos", no
como ranking de misterios.

## Criterios de éxito

1. No hay nombres, perfiles ni comparación.
2. Apagar la comunidad deja la app completa.
3. El diario local no se sube.
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.

## Decisiones abiertas

- Si se construye. Recomendación: solo si hay demanda real después del lanzamiento. Hasta
  entonces, el sitio puede decir "reza a la misma hora que otros" sin contar a nadie.
- Dónde vive el pulso. Recomendación: un servicio mínimo y anónimo, sin cuentas, distinto
  de cualquier diario.

## Bloqueo (agosto 2026)

Un contador de "quién reza ahora" pide servidor. La decisión 4 es empezar sin backend, y
lo rezado no sale del dispositivo. El sitio ya dice que a la hora del Ángelus mucha gente
reza, sin contar a nadie. El pulso anónimo espera demanda real después del lanzamiento.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App
- [ ] ~~Reloj - n/a: elegir comunidad es configurar~~
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] Sitio - si el número existe, el sitio no promete una red que la app no tiene

## Fuentes

- [`../gamificacion.md`](../gamificacion.md) §7; decisión 4; `.agents/conventions.md`
  (privacidad)
