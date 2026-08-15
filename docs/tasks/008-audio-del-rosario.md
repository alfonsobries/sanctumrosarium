# Task 008 - Audio del Rosario

## Objetivo

Que el Rosario se pueda rezar con voz: la guía dice su parte, deja espacio para la
respuesta, y todo funciona sin conexión, en segundo plano y con la pantalla apagada.

## Dependencias

- Task 005 (motor), 007 (pantalla)

## Contexto

El audio es el trabajo más caro del proyecto y el que decide si la app sirve para correr,
manejar o rezar a oscuras.

La decisión de voces (humanas o sintetizadas, y quién graba) está abierta:
[`../DECISIONES.md`](../DECISIONES.md), decisión 5. Esta task construye el sistema; el
contenido de audio entra conforme se graba.

Principio que manda sobre el diseño: **la app no reza por ti**. La guía dice la primera
mitad y calla. Si el usuario prefiere escuchar el Rosario entero rezado, es un ajuste, no
el modo por defecto.

## Qué construir

### 1. Reproducción

Encadenar decenas de pistas cortas (una por oración o por mitad de oración) sin silencios
raros entre ellas. Velocidad ajustable. Volumen independiente de la música.

### 2. Espacio para responder

Tras la parte del guía, silencio del largo configurado (o hasta que el usuario toque). El
silencio por defecto se calcula del largo de la respuesta, no es un número fijo.

### 3. Segundo plano

Sigue sonando con la pantalla apagada y con la app en segundo plano. Aparece en la
pantalla de bloqueo y en el coche con el misterio actual (los controles finos son la task
020).

### 4. Offline

El paquete de audio de un idioma se descarga una vez y se guarda. La app dice cuánto ocupa
antes de descargar y permite borrarlo. Sin descarga, la app funciona con texto.

### 5. Música de fondo

Opcional, apagada por defecto, y por debajo de la voz. Una queja recurrente en el nicho es
que la música tapa la oración.

### 6. Interrupciones

Llamada, mensaje de voz, navegador GPS: se pausa y se retoma sola, en la cuenta exacta.

## Criterios de éxito

1. Se puede rezar el Rosario entero con audio, sin conexión, con la pantalla apagada.
2. El espacio para responder es suficiente para decir la parte en voz alta sin prisa, en
   cada idioma.
3. Una llamada entrante pausa y al colgar retoma en la misma cuenta.
4. La descarga por idioma se puede hacer, ver y borrar, con su tamaño a la vista.
5. La música de fondo, si se activa, nunca tapa la voz.
6. Con auriculares Bluetooth, no hay cortes entre pistas.
7. Tests cubren: encadenado de pistas, cálculo del silencio de respuesta, pausa y retoma
   por interrupción, y el estado de descarga.

## Decisiones abiertas

- Formato y calidad del audio, buscando el tamaño más chico que suene bien con voz
  hablada.
- Si las pistas son por oración completa o por mitad. Recomendación: por mitad, para poder
  intercalar el silencio sin cortar.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: el motor ya expone los pasos~~
- [ ] App
- [ ] ~~Reloj - n/a: el audio del reloj es la task 017~~
- [ ] Audio
- [ ] Accesibilidad - el reproductor se opera con lector de pantalla; el audio no pelea
      con VoiceOver
- [ ] ~~Sitio - n/a~~

## Fuentes

- [`../referencias/tecnica/`](../referencias/tecnica/) para las opciones de reproducción y
  formato
