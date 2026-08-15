# Task 010 - Rezar a pantalla apagada

## Objetivo

Rezar sin mirar: pantalla en negro o apagada, avance por tacto o por voz de la guía, y un
toque háptico por cuenta.

## Dependencias

- Task 007, 008

## Contexto

Se reza en la cama antes de dormir, con los ojos cerrados, caminando de noche. La pantalla
encendida molesta, gasta batería y ata la atención a un rectángulo.

La háptica sustituye a las cuentas de los dedos: un toque distinto para el Ave, para el
Padrenuestro y para el Gloria. Es lo que la competencia hace a medias (hay reseñas
pidiendo "vibración más fuerte" y "distinguir el Padrenuestro").

Nota doctrinal: esto no sustituye el rosario de cuentas, que es un sacramental. El copy lo
dice cuando toca, sin sermonear.

## Qué construir

### 1. Modo a oscuras

Pantalla negra con lo mínimo (misterio y cuenta, tenues), o apagada del todo si el sistema
lo permite. Se entra con un gesto claro y se sale igual.

### 2. Háptica

Patrón distinto por tipo de oración, ajustable en intensidad, y apagable. Nunca háptica
continua.

### 3. Avance sin mirar

Toque en cualquier parte, o automático con el audio. Nada que requiera apuntar a un botón.

### 4. Batería

El modo a oscuras tiene que gastar notablemente menos que la pantalla encendida. Se mide.

## Criterios de éxito

1. Se puede rezar el Rosario entero con los ojos cerrados, solo con audio y háptica.
2. Los tres patrones hápticos se distinguen a ciegas.
3. La háptica se apaga y la app sigue funcionando igual.
4. El consumo de batería del modo a oscuras se midió y está documentado en la task.
5. Tests cubren: entrada y salida del modo, patrones por tipo de paso, ajuste de
   intensidad.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App
- [ ] ~~Reloj - n/a: en el reloj la háptica es la task 018~~
- [ ] Audio - el modo a oscuras depende del audio para el ritmo
- [ ] Accesibilidad - el modo a oscuras es en sí una función de accesibilidad; se verifica
      con lector de pantalla activo
- [ ] ~~Sitio - n/a~~
