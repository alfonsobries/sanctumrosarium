# Task 034 - Escuela del Rosario

## Objetivo

Una sección para leer: qué es el Rosario, de dónde viene, qué dice la Iglesia, y qué no
es.

## Dependencias

- Task 031, 013

## Contexto

RVM 5 llama al Rosario "escuela de oración". Quien ya reza a veces quiere saber más; quien
empieza lo necesita. El sitio y la app leen el mismo contenido.

Lo que tiene que quedar claro, porque el nicho lo confunde:

- Las quince promesas son tradición piadosa del beato Alano, no magisterio.
- Las indulgencias se describen con sus condiciones; la app no las otorga.
- El rosario (objeto) no protege por sí mismo (CIC 2111, RVM 28).

## Qué construir

### 1. Páginas

Historia (tradición e historia crítica, sin resolver lo que la Iglesia no resuelve),
estructura, misterios, método de RVM, promesas con su estatus, indulgencias con
condiciones, el manifiesto anti-amuleto.

### 2. Fuentes a la vista

Cada afirmación lleva su cita. Magisterio, liturgia y tradición piadosa se distinguen.

### 3. Superficies

App y sitio, del mismo paquete. En el reloj no.

## Criterios de éxito

1. Las quince promesas aparecen con origen y sin lenguaje de garantía.
2. La página de indulgencias cita EI 17 y no marca ninguna como conseguida.
3. Un escrupuloso no sale más obligado de lo que entró.
4. Todo el copy pasa el skill `voz` y el agente `revisor-doctrinal`.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Seis páginas en `packages/content/src/school`**, leídas por la app (Inicio > Escuela
  del Rosario) y por el sitio (/escuela y /en/school) del mismo dato: qué es, de dónde
  viene, el método, las promesas, las indulgencias y el rosario como objeto.
- **Cada bloque lleva su cita visible y su género** (`magisterium` / `liturgy` /
  `tradition` / `note`): el lector siempre sabe quién habla. Un test garantiza que ninguna
  cita nombra un documento interno del repo, y la fuente principal va por idioma (el
  lector inglés recibe la edición inglesa de vatican.va).
- **Dos revisiones (crítico litúrgico y revisor doctrinal) aplicadas enteras**: citas
  reatribuidas (compendio a MC 42/RVM 1; "costumbre loable" a RVM 33; el 150 de la rosa
  41), las anchuras de las normas de indulgencias (una confesión para varias plenarias,
  días antes o después, el Padrenuestro y Avemaría por el Papa), la advertencia de que una
  grabación o el audio de la app no entran en la letra de la concesión 17, la libertad de
  MC 55/DPPL 202, las distracciones (CIC 2729; Montfort rosas 42-43), la postura (rosa
  45), la libre adopción de los luminosos (RVM 19), la prevalencia del día litúrgico
  (DPPL 200) y el "qué no es" (coronilla, Siete Dolores, misterios inventados). Las citas
  inglesas no verificadas se pasaron a discurso indirecto.
- Los "veinte misterios" y la estructura esencial quedan en la página "Qué es"; los
  misterios completos ya tienen su propia superficie (app y sitio).
- **Pendiente**: una página de estructura con las formas regionales en la app (el sitio ya
  la tiene en /como-se-reza); cotejar en vatican.va EN las citas inglesas que hoy van en
  indirecto; y las preguntas que solo puede responder quien reza en cada región (esquema
  semanal viejo vs. RVM 38 en gente mayor, versión española corriente de las promesas y su
  imprimatur, formulación de indulgencias revisada por un confesor).

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - paquete `school` con sus tests
- [x] App
- [x] ~~Reloj - n/a: se lee~~
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - texto plano con jerarquía de encabezados; fuentes como texto
- [x] Sitio - son las mismas páginas, en la nav como "Escuela"

## Fuentes

- Dossier A (magisterio), B.5 (promesas), A.8 (indulgencias), B.6 (anti-amuleto)
