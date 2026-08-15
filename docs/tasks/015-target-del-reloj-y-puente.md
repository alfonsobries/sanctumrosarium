# Task 015 - Target del reloj y puente

## Objetivo

Que exista una app de Apple Watch dentro del proyecto, que se compile de forma
reproducible y que hable con el teléfono.

## Dependencias

- Task 006

## Contexto

Es la apuesta del producto: nadie tiene el Rosario en el reloj con audio propio. También
es la parte más frágil técnicamente. Lo verificado está en
[`../referencias/tecnica/apple-watch.md`](../referencias/tecnica/apple-watch.md); lo que
hay que tener presente antes de empezar:

- La app del reloj se escribe en Swift. No hay forma de correr la interfaz de la app móvil
  ahí.
- El plugin que permite tener el target dentro del proyecto tiene un fallo abierto que
  rompe el ensamblado en cada regeneración del proyecto nativo, y un histórico de rechazos
  de tienda por versiones desalineadas entre la app y el reloj.
- Los contenedores compartidos **no** cruzan del teléfono al reloj: eso solo se resuelve
  con el canal de comunicación entre ambos, o con iCloud.
- Sin sesión activa (ejercicio o audio), la app del reloj se suspende a los dos minutos de
  bajar la muñeca.

## Qué construir

### 1. El target

App de watchOS dentro del proyecto, que sobrevive a regenerar el proyecto nativo, con sus
identificadores y versiones sincronizados con la app móvil.

### 2. El puente

Módulo nativo propio para hablar entre teléfono y reloj: enviar el estado ("esto es lo que
reza hoy, con estos ajustes"), y recibir del reloj lo que se rezó. Con la vía que entrega
aunque el otro lado no esté despierto, no solo la de mensajes en vivo.

Se escribe a mano en lugar de usar la librería existente de la comunidad, que hoy tiene un
fallo de compilación abierto por colisión de nombres.

### 3. Contenido en el reloj

Los textos y los misterios del idioma activo viven en el reloj, no se piden al teléfono.
El rezo nunca depende de que el teléfono esté cerca ni encendido.

### 4. Compilación

Comando documentado que compila teléfono y reloj juntos, en local, y verifica que las
versiones coinciden antes de subir.

## Criterios de éxito

1. El proyecto se regenera desde cero y el target del reloj sigue compilando, sin pasos
   manuales.
2. Las versiones de la app y del reloj coinciden siempre, verificado por una comprobación
   automática antes de subir.
3. El reloj tiene el contenido del idioma activo y funciona con el teléfono apagado.
4. Los ajustes cambiados en el teléfono llegan al reloj sin que el usuario haga nada.
5. Lo que se reza en el reloj llega al diario del teléfono, aunque el teléfono estuviera
   apagado mientras tanto.
6. Está documentado en la task qué versión del plugin se usa y qué parche hace falta, si
   lo hay.

## Decisiones abiertas

- Si el reloj sincroniza también por iCloud, para no depender del emparejamiento.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: los reutiliza~~
- [ ] App - el lado del teléfono del puente
- [ ] Reloj
- [ ] ~~Audio - n/a: task 017~~
- [ ] ~~Accesibilidad - n/a: sin interfaz todavía~~
- [ ] ~~Sitio - n/a~~
