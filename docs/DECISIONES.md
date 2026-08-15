# Decisiones pendientes

Lo que falta decidir para que el proyecto avance, con opciones, recomendación y qué
bloquea cada una. Cuando una se cierra, se mueve a "Decidido" al final con su fecha y su
razón.

## 1. Nombre del producto

**Bloquea:** repositorio en GitHub, dominio, identificador de la app en las tiendas,
icono, todo el copy del sitio.

Los nombres ya usados y el análisis completo están en
[`../competencia/nombres.md`](../competencia/nombres.md). El nicho está saturado de
"Rosary / Rosario / Rosarium" con adjetivo; los nombres nuevos que funcionan son de una
palabra, latina o mariana (Hallow, Amen, Memorare, Contemplatio, Orabimus).

Shortlist, con dominios verificados por RDAP en agosto 2026 (reconfirmar en el
registrador):

| Nombre        | Por qué                                                                   | Dominio                                                           |
| ------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Decena**    | La unidad real del Rosario. Corta, cabe en el reloj, funciona en ES/EN/IT | decena.app y decena.com tomados; decena.co y getdecena.com libres |
| **Decenario** | Palabra litúrgica auténtica (el rosario de diez cuentas)                  | decenario.app libre                                               |
| **Gaudete**   | Latín reconocible, alegre, se pronuncia bien en cualquier idioma          | gaudete.app libre                                                 |
| **Quindecim** | Los quince misterios clásicos y las quince promesas                       | quindecim.app libre                                               |
| **Misteria**  | Evoca los misterios sin decir "rosario"                                   | misteria.app libre                                                |

**Recomendación: Decena**, con `.co` o un dominio con prefijo, o **Decenario** si se
quiere el `.app` limpio. Es la palabra que ya usa cualquiera que reza ("me falta una
decena"), es corta para el reloj y la complicación, y no colisiona con ninguna app del
nicho.

**Pendiente además:** verificar colisión de marca en App Store y Play, y registrar el
dominio antes de anunciar nada.

## 2. Identidad visual

**Bloquea:** icono, splash, sitio, láminas de tienda.

Dos direcciones posibles:

- **Sobria y monástica.** Poco color, tipografía con serifa, mucho aire, referencia a
  manuscritos y a la piedra. Envejece bien, se ve seria, encaja con el latín. Riesgo:
  fría, "de misal".
- **Cálida y cercana.** Color suave, formas redondeadas, sensación de casa y de rezo en
  familia. Riesgo: infantil o genérica.

**Recomendación:** sobria como base (es una app para rezar de noche y en silencio, y el
modo oscuro es el uso principal), con una sola nota cálida de marca. Decidir con bocetos,
no con adjetivos.

También pendiente: si hay un símbolo (cuenta, rosa, corona) y si el icono funciona en la
esfera del reloj a tamaño mínimo.

## 3. Modelo económico

**Recomendación (y la inclinación actual): gratis y completa, con donativos.** Sin
anuncios, sin paywall en el Rosario, sin funciones espirituales de pago. Propina dentro de
la app donde las tiendas lo permitan, y donativo en el sitio.

Alternativas descartables pero anotadas: suscripción de "sostenedor" simbólica
(referencias del nicho: 4 a 6 dólares al año), pago único, o solo donativo web. Lo que
**no** se hace es cobrar por misterios, idiomas o audio.

Falta decidir: si hay propina dentro de la app desde el primer día o solo en el sitio, y
con qué procesador en la web.

## 4. Backend: ¿existe?

- **Sin backend.** Todo local, respaldo con iCloud. Más simple, más privado, cero costo.
  No permite sincronizar entre dispositivos de forma fiable ni comunidad.
- **Backend propio.** Sincronía, comunidad ligera ("cuántos rezan ahora"), estadísticas.
  Costo y mantenimiento, y una base de datos con hábitos de oración de gente, que es dato
  sensible.

**Recomendación:** empezar **sin backend**. El reloj y el teléfono se sincronizan entre
ellos; el respaldo es del sistema. La comunidad ligera (fase 10) puede resolverse con un
servicio mínimo y anónimo cuando llegue, sin cuentas.

## 5. Voces del audio

**Bloquea:** todo el trabajo de audio, que es el más caro del proyecto.

- **Voces humanas grabadas.** Es lo correcto para una app de oración y lo que distingue.
  Requiere locutor por idioma y variante (español de México, español de España, inglés,
  latín), estudio o grabación decente, y horas de edición. El latín necesita alguien que
  lo pronuncie de verdad.
- **Síntesis de voz.** Rápida y barata, permite muchos idiomas de golpe. Riesgo real de
  rechazo: hay desconfianza declarada en el nicho hacia lo generado por IA en contenido
  espiritual, y el latín eclesiástico se le atraganta a los modelos.

**Recomendación:** humanas para español, inglés y latín; síntesis solo como andamio
interno de desarrollo, nunca en producción sin decirlo. Pendiente: quién graba, y si se
puede pedir a un sacerdote o seminarista el latín.

## 6. Alcance del latín en la primera versión

¿El latín entra en la versión 1 como idioma completo, o llega en la fase 3? Es el mayor
diferenciador y también el trabajo de audio más difícil.

**Recomendación:** textos en latín desde la versión 1 (son de dominio público y ya están
levantados), audio en latín en la fase 3 con voz humana.

## 7. Detección de la respuesta hablada

Para el modo a dos voces: la app dice la primera mitad y hay que saber cuándo terminaste.

- **Solo tiempo y tacto.** Robusto, sin permisos, sin batería. Menos mágico.
- **Detección de voz por energía y silencio.** Sin reconocer palabras: solo saber que
  hablaste y callaste. Funciona en cualquier idioma, incluido el latín. Requiere permiso
  de micrófono.
- **Reconocimiento de palabras en el dispositivo.** Preciso donde el idioma existe,
  imposible en latín, más batería y más permisos.

**Recomendación:** tiempo y tacto en la versión 1; detección de voz por energía como
opción cuando esté probada. Reconocimiento de palabras, no.

## 8. Medición del recogimiento

Si entra en la versión 1 o espera, y si se conecta con Salud (frecuencia cardiaca y
variabilidad). Es el diferenciador más original y también el más delicado doctrinalmente.

**Recomendación:** esperar a la fase 6, hacerlo opt-in y sin puntaje, y probarlo con gente
que reza a diario antes de publicarlo. Si se siente como un examen, se quita.

## 9. Arte de los misterios

- **Dominio público** de museos abiertos: gratis, obras reales, catequesis por sí mismas.
  Trabajo de curaduría por misterio y variedad estilística difícil de unificar.
- **Ilustración propia**: coherencia total, costo alto o dependencia de generación por IA,
  con el mismo problema de percepción que las voces.

**Recomendación:** dominio público, con curaduría cuidada y ficha de la obra visible. Es
más fiel al espíritu del producto y le da cuerpo al sitio.

## 10. Traducción bíblica por idioma

Las citas de cada misterio necesitan un texto con licencia clara. Hay opciones de dominio
público en latín, inglés y español, y opciones con derechos que requieren licencia pagada
para apps.

**Pendiente:** cerrar la lista por idioma, con la nota de derechos, antes de escribir el
contenido.

## 11. Cofradía del Rosario

¿Se integra la inscripción a la Cofradía (dominicos) y un contador semanal de quince
decenas? Es tradición viva, gratuita, sin cuotas, y encaja con la idea de Regla.

**Recomendación:** sí, como una Regla más y un enlace a la inscripción, con el texto que
la propia Cofradía usa: no obliga bajo pecado.

## 12. Android y Wear OS

El reloj de Apple es la apuesta. Android entra desde el principio en el teléfono, pero
Wear OS es otro proyecto.

**Recomendación:** Android sí, Wear OS solo si aparece demanda real.

## 13. Código abierto

Parte del proyecto podría liberarse: el paquete de contenido litúrgico (textos, misterios,
estructuras regionales) es un bien común y nadie lo tiene bien hecho.

**Recomendación:** liberar el paquete de contenido y el motor del Rosario; mantener
cerrada la app. Decidir antes de publicar el repositorio, porque cambia cómo se organiza.

## 14. Analítica

**Recomendación:** ninguna analítica de comportamiento. Solo reporte de errores, y con lo
mínimo. Lo que alguien reza no se registra fuera de su teléfono. Si algún día hace falta
saber si una pantalla se usa, se pregunta.

## 15. Cuenta de publicación

Con qué cuenta de desarrollador se publica, si hay una entidad detrás, y si el sitio y la
app comparten dominio. Afecta a los identificadores de la app, que después no se cambian.

---

## Decidido

_(Vacío por ahora. Cada decisión cerrada baja aquí con fecha y una línea de razón.)_
