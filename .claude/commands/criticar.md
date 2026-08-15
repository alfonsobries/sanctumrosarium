Ataca la spec de una task **antes** de implementarla, para descubrir los huecos mientras
todavía son baratos de cerrar.

Argumento: el número o el nombre de la task (`/criticar 005` o `/criticar motor`). Sin
argumento, la siguiente task pendiente según `docs/ROADMAP.md`.

## Pasos

1. Lee la task completa en `docs/tasks/`.

2. Lanza `@critico-liturgico` con este prompt:

   > Ataca la spec de `docs/tasks/<archivo>`. Ancla todo en `docs/referencias/`, cita
   > documento y sección, y marca como SUPOSICIÓN NO VERIFICADA lo que no puedas anclar.

3. Si la task toca progresión, métricas, copy devocional o cualquier cosa que el usuario
   pueda leer como una promesa, lanza también `@revisor-doctrinal` en paralelo con la spec
   como contexto.

4. Si la task toca el reloj, el audio o algo del stack, lanza `@cto` con
   `docs/referencias/tecnica/` como contexto: ahí está lo que ya se verificó que puede no
   funcionar.

5. Presenta el resultado en tres bloques separados, sin mezclarlos:
   - **Anclado** (con cita): listo para agregarse a los criterios de éxito de la task
   - **Suposiciones**: para validar, no para implementar
   - **Preguntas**: lo que solo puede contestar alguien que reza en esa lengua o esa
     región

6. Pregunta qué criterios anclados agregar a la task. **No los agregues sin
   confirmación**: la spec es del dev.

## Por qué antes y no después

En este producto los errores caros no son de código, son de contenido: una oración que no
es la de ese país, un misterio en el día equivocado, una promesa mal formulada.
Descubiertos en la spec cuestan una línea; descubiertos en una reseña de la tienda,
cuestan la credibilidad.
