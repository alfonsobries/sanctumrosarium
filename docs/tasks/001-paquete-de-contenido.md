# Task 001 - Paquete de contenido litúrgico

## Objetivo

Crear `packages/content`: el paquete que guarda todo lo que se reza (oraciones, misterios,
estructuras del rezo por región, calendario) con su fuente, tipado y probado, sin saber
nada de la app ni del sitio.

## Contexto

Todo el producto cuelga de aquí. Un error en este paquete es un error litúrgico visible en
las reseñas, que es la forma más rápida de perder credibilidad en este nicho: hay reseñas
reales castigando a una app grande porque "en el rosario del martes se salta el primer
Padrenuestro" (ver [`../../competencia/apps.md`](../../competencia/apps.md)).

El dossier [`../referencias/rosario-doctrina.md`](../referencias/rosario-doctrina.md) es
la fuente de verdad del contenido. Lo esencial que este modelo tiene que poder
representar, según MC 49 y RVM 37: lo **esencial** del Rosario es meditación de los
misterios, Padrenuestro, diez Avemarías y Gloria. Todo lo demás (inicio con Credo o con
"Dios mío, ven en mi auxilio", jaculatoria tras cada decena, tres Avemarías iniciales,
letanías, oración final, tres "Dios te salve María Santísima" de la forma mexicana) es
marco legítimo pero **variable por región**. El modelo tiene que hacer esa distinción
explícita, no cablear la forma de un país.

## Qué construir

### 1. Modelo de datos

Entidades, en TypeScript con tipos exactos y sin `any`:

- **`Prayer`** - una oración: identificador estable (`ave-maria`, `pater-noster`,
  `salve-regina`), y por idioma sus versiones: texto completo, texto partido en líneas, y
  **partido en dos mitades** (guía y respuesta) para el modo a dos voces.
- **`PrayerVersion`** - un texto concreto en un idioma y variante (`es-MX`, `es-ES`,
  `en-US`, `la`), con `source` obligatorio: qué documento lo respalda (Compendio del
  Catecismo, USCCB, texto litúrgico regional) y su URL.
- **`Mystery`** - misterio: ciclo (gozoso, luminoso, doloroso, glorioso), orden, título
  por idioma, cita bíblica (referencia y texto), fruto, meditación breve, imagen.
- **`MysterySet`** - los cuatro ciclos con sus cinco misterios.
- **`RosaryForm`** - la forma regional del rezo: qué pasos abren, qué se dice entre
  decenas, qué cierra. Es una lista de referencias a oraciones con banderas de
  opcionalidad, no código.
- **`Clause`** - la frase que se añade tras el nombre de Jesús en cada decena (obligatoria
  en la forma alemana, opcional en las demás; DPPL 201).

### 2. Formas regionales

Al menos cuatro `RosaryForm` completas y probadas:

- `roman` - la común, en la forma que enseña la USCCB
- `es-MX` - forma mexicana: por la señal, acto de contrición, ofrecimiento, jaculatoria
  "María, Madre de gracia" tras cada decena, tres "Dios te salve, María Santísima" al
  final, letanías
- `es-ES` - forma española: apertura con "Señor, abre mis labios", ofrecimiento, cierre
  propio
- `dominican` - forma dominicana

La forma alemana (misterio como cláusula dentro del Ave, sin anuncio aparte) queda
documentada en el modelo aunque su contenido llegue con la fase 8: es la prueba de que el
modelo no está cableado a la forma romana.

### 3. Contenido inicial

- Oraciones en `es-MX`, `es-ES`, `en-US` y `la`: señal de la cruz, Credo, Padrenuestro,
  Avemaría, Gloria, oración de Fátima, Salve, oración final, Bajo tu amparo, San Miguel, y
  los textos propios de la forma mexicana y española.
- Letanías lauretanas completas en los cuatro, **con las invocaciones añadidas en 2020**
  ("Madre de la misericordia", "Madre de la esperanza", "Consuelo de los migrantes") en su
  posición correcta.
- Los veinte misterios llegan en la task 003.

### 4. Validación

Un validador que corre en las pruebas y falla si:

- Una oración no tiene `source`.
- Una forma regional referencia una oración que no existe en ese idioma.
- Un idioma tiene una oración incompleta (falta la partición guía/respuesta).
- Las letanías no tienen el mismo número de invocaciones en todos los idiomas.

### 5. Publicable por sí solo

El paquete no importa nada de la app. Sus pruebas corren con
`pnpm --filter @rosario/content test`. Se escribe pensando en que algún día se publique
como paquete abierto (ver decisión 13).

## Criterios de éxito

1. Los cuatro idiomas iniciales tienen todas las oraciones del Rosario, cada una con su
   fuente.
2. Las cuatro formas regionales se resuelven a una lista de pasos correcta y probada.
3. La forma mexicana no es la romana con otro texto: incluye sus piezas propias en su
   sitio.
4. Las letanías incluyen las invocaciones de 2020 en la posición que indica el decreto.
5. El validador falla si falta una fuente o si una forma referencia algo inexistente.
6. Ningún texto del paquete está escrito de memoria: todos salen de una fuente citada en
   el dossier.
7. Tests cubren: cada forma regional, cada idioma, el validador con casos que deben
   fallar.

## Decisiones abiertas

- Formato de almacenamiento: TypeScript tipado (más seguro, se compila) o JSON con esquema
  (más fácil de consumir desde el sitio y desde otras plataformas). Recomendación: JSON
  validado con esquema, envuelto en tipos de TypeScript, para que el reloj y el sitio
  puedan leerlo sin compilar.
- Si los textos regionales van en el mismo archivo por idioma o en archivos por variante.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] ~~App - n/a: este paquete no tiene interfaz~~
- [ ] ~~Reloj - n/a: sin interfaz~~
- [ ] ~~Audio - n/a: los textos no traen audio todavía (task 008)~~
- [ ] ~~Accesibilidad - n/a: sin interfaz~~
- [ ] ~~Sitio - n/a: el sitio lo consume en la task 013~~

## Fuentes

- [`../referencias/rosario-doctrina.md`](../referencias/rosario-doctrina.md), secciones
  C.1 a C.4
- Compendio del Catecismo, apéndice de oraciones comunes (ES/EN/LA)
- USCCB, "How to Pray the Rosary"
- Letanías lauretanas en vatican.va, con el decreto de 2020

## Primera pasada (agosto 2026)

Hecho:

- Modelo de datos completo en `packages/content/src/types.ts`, con `source` obligatorio.
- Cuatro formas regionales (`roman`, `es-MX`, `es-ES`, `dominican`) en `src/forms/`.
- Validador en `src/validate.ts` y 19 pruebas en `src/__tests__/content.test.ts`.

Pendiente:

- Las letanías lauretanas: el modelo tiene el paso `litany`, pero el contenido de las
  invocaciones no está levantado todavía.
- La forma alemana, que mete el misterio como cláusula dentro del Ave, sigue solo
  documentada.
- Decisión de formato (TypeScript contra JSON con esquema) resuelta de hecho a favor de
  TypeScript tipado. Si el reloj o el sitio necesitan JSON plano, se genera desde aquí.
