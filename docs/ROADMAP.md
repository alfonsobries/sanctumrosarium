# Roadmap

> Plan de ejecución paso a paso. Cada task deja el producto funcionando, probado y listo
> para seguir. El mapa completo de lo que se construye está en
> [`FEATURES.md`](./FEATURES.md); este archivo ordena el trabajo.

**Cómo leer este plan.** Las tasks están numeradas para leerse en orden y **sin huecos**.
El número dice posición y el slug dice identidad: si el orden cambia, se renumera para
conservar la regla. Las 47 tienen spec. Las lejanas se reabren contra el código cuando
llegue su turno: son specs, no ley.

## Modelo mental

```
Contenido litúrgico (textos, misterios, calendario)
  -> lo consume el Motor del Rosario (secuencia de pasos)
       -> lo pinta la app (pantalla de rezo)     -> y el reloj (su propia interfaz)
       -> lo dice el audio (pistas + timings)
       -> lo registra el diario (qué se rezó, cuándo, por quién)
            -> del diario salen la Regla, la fidelidad, las rosas y el Camino
```

Reglas del modelo:

- **El contenido no sabe de la app.** Es un paquete propio, con sus pruebas, que podría
  publicarse solo. La app y el sitio lo consumen.
- **El motor no sabe de React.** Es lógica pura probada con tests: dado un idioma, una
  región, un día y unos ajustes, produce la secuencia de pasos del Rosario.
- **El diario es local.** Lo que alguien reza no sale de su dispositivo.

## Ciclo de cada task

Toda task de producto termina con el ciclo del skill **`ciclo-completo`**: una feature no
está terminada cuando funciona en el simulador.

1. **Contenido y motor** con pruebas, si la task los toca
2. **App** construida y validada, con todos sus estados
3. **Reloj** cuando aplica ([criterios de superficies](../.agents/superficies.md))
4. **Audio** grabado, cortado y empaquetado, cuando aplica
5. **Accesibilidad** verificada en el dispositivo, no en el código
6. **Sitio** actualizado cuando la feature cambia lo que el sitio promete

### Checklist por task

Cada task termina con una sección `## Ciclo completo` con esas casillas. Lo que no aplica
se tacha con su razón: `- [x] ~~Reloj - n/a: razón~~`. Un "no aplica" no es definitivo: se
vuelve a cuestionar al retomar la task.

## Estándares de la app

Aplican a toda pantalla, sin que la task lo pida:

- **Estados completos**: vacío, cargando, error, sin permiso, primera vez, sin audio
  descargado, sin conexión.
- **Modo claro y oscuro**, con el oscuro como uso principal (se reza de noche).
- **Tipografía grande de verdad**: la app tiene que servir a alguien de ochenta años. Se
  prueba con el tamaño de fuente del sistema al máximo.
- **VoiceOver y TalkBack**: se recorre la pantalla de rezo entera con el lector antes de
  darla por hecha.
- **Nada bloquea el rezo**: ningún diálogo, permiso o aviso interrumpe una sesión en
  curso.
- **Offline por defecto**: si algo necesita red, funciona sin ella o no existe.

## Índice de tasks

### Bloque A - Rezar bien (fase 1)

| #   | Task                                                                          | Estado         |
| --- | ----------------------------------------------------------------------------- | -------------- |
| 001 | [Paquete de contenido litúrgico](./tasks/001-paquete-de-contenido.md)         | Primera pasada |
| 002 | [Textos de las oraciones](./tasks/002-textos-de-las-oraciones.md)             | Primera pasada |
| 003 | [Los veinte misterios](./tasks/003-los-veinte-misterios.md)                   | Primera pasada |
| 004 | [Calendario y misterio del día](./tasks/004-calendario-y-misterio-del-dia.md) | Primera pasada |
| 005 | [Motor del Rosario](./tasks/005-motor-del-rosario.md)                         | Primera pasada |
| 006 | [Base de la app](./tasks/006-base-de-la-app.md)                               | Primera pasada |
| 007 | [Pantalla de rezo](./tasks/007-pantalla-de-rezo.md)                           | Primera pasada |
| 008 | [Audio del Rosario](./tasks/008-audio-del-rosario.md)                         | Primera pasada |
| 009 | [Resaltado sincronizado](./tasks/009-resaltado-sincronizado.md)               | Primera pasada |
| 010 | [Rezar a pantalla apagada](./tasks/010-rezar-a-pantalla-apagada.md)           | Primera pasada |
| 011 | [Ajustes del rezo](./tasks/011-ajustes-del-rezo.md)                           | Primera pasada |
| 012 | [Accesibilidad](./tasks/012-accesibilidad.md)                                 | En curso       |
| 013 | [Sitio](./tasks/013-sitio.md)                                                 | Pendiente      |
| 014 | [Listo para las tiendas](./tasks/014-listo-para-las-tiendas.md)               | Pendiente      |

### Bloque B - Rezar en movimiento (fase 2)

| #   | Task                                                                      | Estado    |
| --- | ------------------------------------------------------------------------- | --------- |
| 015 | [Target del reloj y puente](./tasks/015-target-del-reloj-y-puente.md)     | Pendiente |
| 016 | [El Rosario en el reloj](./tasks/016-el-rosario-en-el-reloj.md)           | Pendiente |
| 017 | [Audio independiente en el reloj](./tasks/017-audio-en-el-reloj.md)       | Pendiente |
| 018 | [Háptica y sesión de ejercicio](./tasks/018-haptica-y-ejercicio.md)       | Pendiente |
| 019 | [Complicación y widget](./tasks/019-complicacion-y-widget.md)             | Pendiente |
| 020 | [Controles de bloqueo y auriculares](./tasks/020-controles-de-bloqueo.md) | Pendiente |

### Bloque C - Latín (fase 3)

| #   | Task                                                  | Qué es                                                         |
| --- | ----------------------------------------------------- | -------------------------------------------------------------- |
| 021 | [Textos en latín](./tasks/021-textos-en-latin.md)     | Todas las oraciones y las letanías lauretanas completas        |
| 022 | [Audio en latín](./tasks/022-audio-en-latin.md)       | Pronunciación eclesiástica, voz humana                         |
| 023 | [Texto bilingüe](./tasks/023-texto-bilingue.md)       | Latín y lengua propia alineados línea a línea                  |
| 024 | [Aprender el latín](./tasks/024-aprender-el-latin.md) | De escuchar a responder de memoria, con el texto que se atenúa |

### Bloque D - Constancia (fase 4)

| #   | Task                                                  | Qué es                                                  |
| --- | ----------------------------------------------------- | ------------------------------------------------------- |
| 025 | [La Regla](./tasks/025-la-regla.md)                   | Norma personal editable que no obliga bajo pecado       |
| 026 | [Fidelidad del mes](./tasks/026-fidelidad-del-mes.md) | Calendario de días fieles, huecos sin drama, modo pausa |
| 027 | [Recordatorio](./tasks/027-recordatorio.md)           | Uno, a tu hora, o el modelo del Ángelus                 |
| 028 | [Intenciones](./tasks/028-intenciones.md)             | Por quién ofreces, con historial                        |
| 029 | [Rosas del mes](./tasks/029-rosas-del-mes.md)         | Corona visual de lo rezado, apagable                    |
| 030 | [Rezar por partes](./tasks/030-rezar-por-partes.md)   | Guardar y retomar, con la nota sobre la indulgencia     |

### Bloque E - El Camino (fase 5)

| #   | Task                                                      | Qué es                                                    |
| --- | --------------------------------------------------------- | --------------------------------------------------------- |
| 031 | [Motor del Camino](./tasks/031-motor-del-camino.md)       | Las ocho etapas y su avance                               |
| 032 | [Meditar](./tasks/032-meditar.md)                         | Lectura de la Palabra y silencio configurable             |
| 033 | [Cláusulas](./tasks/033-clausulas.md)                     | Frase del misterio tras el nombre de Jesús                |
| 034 | [Escuela del Rosario](./tasks/034-escuela-del-rosario.md) | Historia, magisterio, promesas e indulgencias, con fuente |

### Bloque F - Recogimiento (fase 6)

| #   | Task                                                              | Qué es                                                          |
| --- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| 035 | [Ritmo y pausas](./tasks/035-ritmo-y-pausas.md)                   | Tiempos por Ave, pausas dentro de la oración, silencio          |
| 036 | [Imagen del misterio](./tasks/036-imagen-del-misterio.md)         | Arte sacro a pantalla completa, con su ficha                    |
| 037 | [Señales de recogimiento](./tasks/037-senales-de-recogimiento.md) | Interrupciones y ritmo: privado, opcional, sin puntaje          |
| 038 | [Salud](./tasks/038-salud.md)                                     | Corazón y variabilidad desde el reloj; sesión de atención plena |

### Bloque G - En familia (fase 7)

| #   | Task                                              | Qué es                                          |
| --- | ------------------------------------------------- | ----------------------------------------------- |
| 039 | [A dos coros](./tasks/039-a-dos-coros.md)         | La app hace de guía o de respuesta, en voz alta |
| 040 | [Modo niños](./tasks/040-modo-ninos.md)           | Menos texto, imágenes grandes, decena suelta    |
| 041 | [Rezo compartido](./tasks/041-rezo-compartido.md) | Varias personas en la misma casa                |

### Bloque H - Después

| #   | Task                                                                  | Qué es                                                       |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| 042 | [Idiomas nuevos](./tasks/042-idiomas-nuevos.md)                       | Italiano, portugués, francés, polaco, alemán y sus variantes |
| 043 | [Letanías](./tasks/043-letanias.md)                                   | Lauretanas completas, rezadas y cantadas                     |
| 044 | [Novena de 54 días](./tasks/044-novena-de-54-dias.md)                 | Estructura propia, con su contador                           |
| 045 | [Coronilla y Siete Dolores](./tasks/045-coronilla-y-siete-dolores.md) | Devociones hermanas, nunca mezcladas con el Rosario          |
| 046 | [Cofradía del Rosario](./tasks/046-cofradia-del-rosario.md)           | Regla semanal de quince decenas e inscripción                |
| 047 | [Rezar a la vez](./tasks/047-rezar-a-la-vez.md)                       | Cuántos rezan ahora, sin nombres ni ranking                  |

## Estado

Las 47 tasks tienen spec. Contenido, calendario y motor están levantados, con pruebas. La
app tiene un andamio de rezo (forma mexicana). El sitio lista los misterios. Ninguna task
está cerrada. Criterio y orden para retomar: [`propuesta.md`](./propuesta.md).

## Principios de ejecución

- **Todo en `main`**, ramas cortas, un PR por task.
- **El contenido y el motor se prueban de verdad.** Son lógica pura: no hay excusa para no
  tener cobertura completa ahí. La UI se prueba donde importa.
- **Crítica litúrgica antes de implementar.** Toda task que toque textos, estructura del
  rezo, indulgencias o progresión pasa por `/criticar` antes de escribir código: los
  errores de contenido son los que hunden una app de este nicho.
- **Verificación después.** El skill `/review` corre el verificador ciego sobre el diff.
- **Commits incrementales**, en español o inglés, formato Conventional Commits, sin
  cuerpo.
- **Ningún atajo de contenido.** Un texto sin fuente identificada no entra, aunque suene
  bien.
