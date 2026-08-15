# Task 018 - Háptica y sesión de ejercicio

## Objetivo

Rezar corriendo: un toque por cuenta, la app viva durante todo el Rosario, y el ejercicio
registrado si el usuario quiere.

## Dependencias

- Task 016, 017

## Contexto

Este es el caso de uso que motiva el reloj: rezar mientras corres o caminas.

De lo verificado en
[`../referencias/tecnica/apple-watch.md`](../referencias/tecnica/apple-watch.md):

- La háptica en segundo plano solo funciona con una sesión de ejercicio activa.
- Cada toque háptico **interrumpe la captura de frecuencia cardiaca** mientras dura. Un
  toque por Ave es aceptable; háptica continua, no.
- Solo puede haber una sesión de ejercicio en el reloj: si el usuario ya está corriendo
  con otra app, la nuestra no puede abrir la suya. Hay que manejarlo, no chocar.

## Qué construir

### 1. Patrones hápticos

Distintos para Ave, Padrenuestro y Gloria, y uno más marcado al cambiar de misterio.
Ajustables y apagables.

### 2. Sesión de ejercicio

Al rezar en movimiento, sesión de ejercicio para mantener la app viva y la pantalla
disponible. Con permiso explícito y explicación de para qué.

### 3. Rezar quieto

Si no hay movimiento, sesión de larga duración del tipo pensado para meditación, en vez de
ejercicio.

### 4. Conflicto con otra app

Si ya hay una sesión de ejercicio de otra app, la nuestra reza igual (con audio) y lo
dice, sin pelear por la sesión.

### 5. Registro

Al terminar, ofrecer guardar la caminata o carrera. Nunca guardar nada sin decirlo.

## Criterios de éxito

1. Con el reloj en la muñeca y corriendo, el Rosario avanza con audio y háptica sin
   interrupciones.
2. Los patrones se distinguen sin mirar.
3. Con otra app de ejercicio activa, la nuestra no falla ni roba la sesión.
4. Nada se escribe en Salud sin permiso y sin avisar.
5. Medido: cuánta batería consume un Rosario completo corriendo, anotado en la task.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] ~~App - n/a~~
- [ ] Reloj
- [ ] Audio - háptica y audio van coordinados
- [ ] Accesibilidad - la háptica es la alternativa no visual del avance
- [ ] ~~Sitio - n/a~~
