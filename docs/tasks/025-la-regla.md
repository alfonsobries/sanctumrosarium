# Task 025 - La Regla

## Objetivo

Que cada quien fije a qué se compromete, lo pueda bajar cuando quiera, y la app nunca se
lo suba sola.

## Dependencias

- Task 006

## Contexto

Es la pieza central de la constancia y la más delicada del producto. El modelo no lo
inventamos: la Cofradía del Rosario (asociación con más de quinientos años) pide a sus
miembros procurar quince decenas semanales y dice, con esas palabras, que **no obliga bajo
pecado**; las asociaciones marianas contemporáneas repiten la misma fórmula y añaden que
fallar unos días no te saca de nada.

Eso es lo que hay que copiar: una norma clara, elegida por el usuario, sin castigo.

El diseño completo está en [`../gamificacion.md`](../gamificacion.md), sección 1.

## Qué construir

### 1. Elegir la Regla

Al empezar o desde ajustes: una decena al día, cinco decenas al día, quince decenas por
semana (al modo de la Cofradía), los veinte misterios, o sin regla.

Cada opción explica en una línea qué implica. La de la Cofradía menciona su origen.

### 2. Bajarla o quitarla

Desde la misma pantalla donde se ve el avance, en un toque, sin diálogo de confirmación
con culpa y sin preguntar por qué.

### 3. Lo que la app nunca hace

- Subir la Regla sola.
- Sugerir subirla más de una vez, y esa vez con un texto que remita a hablarlo con un
  director espiritual.
- Enseñar la Regla de nadie más.

### 4. El texto

En la pantalla, la frase que usan la Cofradía y las asociaciones marianas: no obliga bajo
pecado. Se escribe con el skill `voz`, y pasa por el agente `revisor-doctrinal`.

## Criterios de éxito

1. Se elige, se cambia y se quita la Regla sin fricción.
2. La app nunca modifica la Regla por su cuenta, verificado por prueba.
3. La regla semanal de quince decenas cuenta decenas, no rosarios, y funciona aunque se
   recen en días sueltos.
4. El texto dice que no obliga bajo pecado.
5. Tests cubren: cada tipo de regla, el cambio a mitad de semana o de mes, y que nada la
   suba sola.

## Decisiones tomadas (primera pasada, agosto 2026)

- **El diario nace aquí**: tabla `prayed` en SQLite con migraciones versionadas y probadas
  (vía node:sqlite en tests). Cada rosario terminado registra un acto: inicio, fin,
  decenas y la **fecha local** de quien reza (un rosario de las 11 pm es de ese día;
  probado). El mismo acto no se registra dos veces.
- **Copy pasado por el revisor doctrinal**, con sus dos bloqueantes corregidos: la línea
  de la Cofradía ya no fecha la obligación en el siglo XV (la asociación tiene más de
  quinientos años y "pide procurar", no "obliga"); y "El Rosario completo" se renombró
  "Los veinte misterios" para no insinuar que el de quince decenas está incompleto. Este
  cambio también corrigió `docs/gamificacion.md` y esta task, que arrastraban el error.
- **"No obliga bajo pecado" aparece una sola vez y atribuido** (en la nota de la Cofradía
  cuando esa regla está elegida), no en voz de la app.
- **La línea del inicio nunca muestra déficit**: con cero rezado enuncia la Regla ("Cinco
  decenas al día"); con algo rezado cuenta actos ("3 de 5 decenas hoy."). Sin cuenta atrás
  y sin notificaciones.
- **Nada la sube sola**: probado que una migración conserva la regla elegida; el único
  camino que la cambia es la pantalla. La sugerencia única de subirla (con remisión a un
  director espiritual) queda para cuando exista, con su texto revisado aparte.
- **Sin regla va primera** y ninguna opción se marca como recomendada: son maneras de
  rezar, no niveles.
- Bajarla o quitarla es tocar otra fila: sin diálogo, sin preguntar por qué.
- El modo pausa y el calendario de fidelidad son la task 026.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - diario con migraciones y cálculo puro de la Regla, con tests
- [x] App
- [ ] Reloj - enseñará el avance cuando exista (task 015)
- [x] ~~Audio - n/a~~
- [ ] Accesibilidad - roles y labels puestos; recorrido en aparato pendiente
- [x] ~~Sitio - n/a~~
