# Referencias técnicas

Lo verificado sobre la plataforma, con fecha y fuente. Sirve para dos cosas: elegir con
datos y **saber de antemano qué puede no funcionar**.

| Documento                                        | Qué cubre                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [`apple-watch.md`](./apple-watch.md)             | Target de watchOS con Expo, audio independiente, háptica, sesiones de ejercicio, complicaciones  |
| [`audio.md`](./audio.md)                         | Reproducción, segundo plano, formato, encadenado de clips, sincronización del texto con el audio |
| [`voces.md`](./voces.md)                         | Síntesis de voz, latín eclesiástico, licencias y costo de locución humana                        |
| [`stack.md`](./stack.md)                         | Monorepo, estilos, datos locales, idiomas, notificaciones, widgets, salud, pruebas, propinas     |
| [`sitio-y-licencias.md`](./sitio-y-licencias.md) | Astro, rezar en el navegador, donativos web, licencias de contenido y accesibilidad              |

## Lo que decidió esta investigación

- **El latín se sintetiza con voz italiana**, porque el "latín" de los sintetizadores ya
  es eso literalmente. Y para el audio de verdad, voz humana voluntaria: un locutor
  comercial tampoco sabe pronunciar latín litúrgico.
- **No se reza en el navegador con la pantalla apagada.** Hay dos fallos abiertos de
  WebKit que describen exactamente ese caso.
- **Las marcas de tiempo del resaltado salen gratis del sintetizador**, así que no hace
  falta alineación forzada salvo con voz humana.
- **El monorepo necesita mucha menos configuración** de la que se creía: ya se aplicó.
- **Nunca "Donar" en la app: "Apoya el desarrollo".** El mecanismo es legal; lo que se
  juzga es el marco narrativo.

## Lo que sigue sin verificarse

Cada documento termina con lo suyo. Lo que más urge, por orden:

1. **La latencia real entre clips de audio.** Es lo único que puede invalidar la
   arquitectura de reproducción, y no hay ninguna cifra publicada.
2. **Reproducir y escuchar a la vez** para el modo a dos voces: es el riesgo número uno
   del proyecto y se prototipa el primer día.
3. **Qué traducción bíblica se usa por idioma**, con su licencia (decisión 10).
4. **Calidad auditiva real del latín sintetizado**: nadie escuchó nada todavía.
