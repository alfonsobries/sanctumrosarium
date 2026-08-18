# SanctaMaria

App (Expo) y sitio (Astro) para rezar el Santo Rosario: español, inglés y latín, con
audio, Apple Watch, y una constancia que no gamifica la oración. Gratis, sin cuenta, sin
anuncios. Dominio: [sanctamaria.app](https://sanctamaria.app).

El mapa de features está en [`FEATURES.md`](./FEATURES.md). El orden de trabajo, en
[`ROADMAP.md`](./ROADMAP.md). La doctrina manda sobre todo:
[`referencias/rosario-doctrina.md`](./referencias/rosario-doctrina.md).

Tres promesas:

1. Texto y audio a la vez, con hueco para responder.
2. El reloj reza solo: audio propio, háptica, corona.
3. Cada texto con su fuente. Magisterio, liturgia y tradición piadosa se distinguen.

---

## Qué hay hoy

Monorepo pnpm: `packages/content`, `packages/engine`, `app/`, `site/`. Git local, sin
remoto. 47 tasks escritas. Ninguna cerrada.

**Contenido.** Oraciones en `es-MX`, `es-ES`, `en-US` y latín, con fuente. Veinte
misterios (título, fruto, cláusula, referencia bíblica; sin texto del pasaje). Letanías
lauretanas con las invocaciones de 2020. Cuatro formas: romana, mexicana, española,
dominicana.

**Motor.** Calendario litúrgico y misterio del día. Secuencia del Rosario. Sesión
(avanzar, volver, decena, intención). Pruebas en verde.

**App.** Dos pantallas: hoy y rezo de la forma mexicana, por toque. Sin persistencia, sin
i18n, sin audio.

**Sitio.** Home y lista de misterios en español e inglés, alimentados por el mismo
paquete. Sin guía, sin donar, sin privacidad.

---

## Qué falta

### Para poder rezar bien

- Texto de las veinte perícopas (bloqueado por la decisión 10).
- Cláusulas ancladas a una fuente, e insertadas de verdad (`withClauses` hoy no hace
  nada).
- Meditaciones citadas, o quitar los `intro` de editor.
- Imágenes de dominio público con ficha.
- Revisión humana del latín.
- San Miguel en alguna forma. San José al final (USCCB).
- Oración por el Papa como Padrenuestro + Ave + Gloria (Enchiridion). Hoy hay otro texto,
  solo en `es-ES`.
- Versículo de cierre por tiempo litúrgico (España).
- Forma mexicana nombrada con honestidad: hoy es apertura romana más marco mexicano.
- Cotejo de Fátima, versículo, oración final y San Miguel en latín.

### Huecos del motor

| Caso                                      | Qué pasa                                           |
| ----------------------------------------- | -------------------------------------------------- |
| `withClauses: true`                       | El Ave sale igual.                                 |
| `withReading: true`                       | Cinco pasos sin versículo.                         |
| Anunciación en Semana Santa               | El calendario la deja gozosa; ese año se traslada. |
| Forma y locale que no combinan            | `MissingPrayerError`, sin guarda.                  |
| Letanías y su oración final               | Se pueden encender por separado.                   |
| 3 Aves de apertura                        | Cuentan Aves sin misterio a la vista.              |
| Fecha local vs Pascua en UTC              | A las 11 de la noche el día puede salir mal.       |
| Epifanía / Bautismo / Ascensión en EE.UU. | El código usa fechas fijas, no las trasladadas.    |

Lo esencial (misterio, Padrenuestro, diez Aves, Gloria) no se puede apagar. Eso está bien.

### Del mapa, sin task propia

Respiraciones antes de empezar (cabe en la 028 o la 037). Latín cantado (paquete de audio,
no etapa). Rosario perpetuo (cabe en la 046). Fiestas marianas en el calendario (004 lo
deja abierto). CarPlay / Android Auto (se decide en la 008).

### Contradicciones a resolver al construir

- PLAN: latín desde el día uno. FEATURES fase 1: español e inglés. Decisión 6: textos en
  v1, audio después. Los textos ya están; la 021 es revisión, no invención.
- PLAN: el reloj no es fase futura. ROADMAP: tiendas (014) antes que el reloj (015).
- AGENTS.md pide NativeWind. `stack.md` pide StyleSheet. Este repo usa StyleSheet.
- Task 027: Ángelus a las 6, 12 y 18, y a la vez "un solo aviso al día".

---

## Decisiones

Las abiertas viven en [`DECISIONES.md`](./DECISIONES.md). Cerradas: nombre (SanctaMaria,
`sanctamaria.app`), stack, síntesis del latín solo para desarrollo, sitio sin rezo a
pantalla apagada.

Criterio de las que siguen abiertas:

**Identidad.** Sobria, una nota cálida. Decidir con bocetos.

**Modelo.** Gratis y completa. "Apoya el desarrollo" dentro de la app, nunca "Donar".
Donativo en el sitio.

**Backend.** Ninguno al lanzar. Reloj y teléfono se hablan entre ellos. El diario no sale.

**Voces.** Humanas en producción. Síntesis solo de andamio, y se dice. El latín lo graba
quien lo pronuncia de verdad, con cesión por escrito.

**Latín en v1.** Textos sí, audio después. La 021 es cotejo y mezcla. El audio es la 022.

**Respuesta hablada.** Tiempo y tacto. Sin reconocimiento de palabras.

**Recogimiento medido.** Más tarde, opt-in, sin nota. No publicar sin una semana de uso
real con gente que reza a diario.

**Arte.** Dominio público, con ficha. Nada de museos vaticanos.

**Biblia.** Veinte pasajes, no la Biblia.

| Lengua  | Usable                   | Nota                                                                               |
| ------- | ------------------------ | ---------------------------------------------------------------------------------- |
| Latín   | Vulgata Clementina       | Dominio público. No la Nova Vulgata.                                               |
| Inglés  | Douay-Rheims (Challoner) | Dominio público, católico, arcaico.                                                |
| Inglés  | NABRE                    | App digital exige licencia y regalía. El techo de 5.000 palabras no aplica a apps. |
| Español | CEE 2010                 | Pedir a BAC / CEE, solo los pasajes.                                               |
| Español | Torres Amat / Scío       | Dominio público, lengua del XIX, OCR sucio.                                        |
| Español | Reina-Valera             | No. Protestante.                                                                   |

Clementina y Douay-Rheims. En español, o Torres Amat (ortografía moderna, fuente a la
vista) o licencia CEE de veinte perícopas. Hasta entonces, `withReading` no se ofrece como
si hubiera texto.

**Cofradía.** Sí, como Regla, sin inscribir. Enlace a los dominicos. "No obliga bajo
pecado."

**Wear OS.** No, salvo demanda.

**Código abierto.** Contenido y motor sí, app no. Decidir antes de publicar el repo.

**Analítica.** Ninguna de comportamiento. Solo errores.

**Cuenta de publicación.** Abierta. Bloquea identificadores. Hay que cerrarla antes de la
014.

### Stack

Expo 57, expo-audio, i18next con polyfill de plurales, kv-store, Maestro.

**NativeWind.** Una sola norma. O NativeWind 4 o StyleSheet, y se borra la otra de
AGENTS.md / stack.md. Este repo usa StyleSheet.

**CarPlay.** Se decide en la 008, con diez clips en dispositivo. expo-audio no lo cubre.
Medir el hueco entre clips: menos de 20 ms no se oye; más de 80 ms se oye en una letanía.
Producción: un archivo por decena, no 53 clips encadenados.

**Latín sintetizado.** Voz italiana + respeleo: sirve para desarrollar. No sirve para
publicar.

---

## Progresión

Se cuenta lo rezado, nunca la gracia. Diseño en [`gamificacion.md`](./gamificacion.md).

| Pieza               | Juicio                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| La Regla            | Construir. Es el producto. La Cofradía lleva siglos con una norma que no obliga bajo pecado.     |
| Fidelidad del mes   | Construir. Calendario que se llena, no racha que se rompe.                                       |
| Rosas               | Después de lanzar. Inocuas si se apagan; el riesgo es que se vuelvan la razón para abrir la app. |
| Camino de 8 etapas  | Recortar a 4 la primera vez: estructura, meditar, cláusulas, responder. El resto son ajustes.    |
| Recogimiento medido | Esperar. Un check de "rezado" es un acto. Contar salidas de la app se siente como examen.        |

La voz de [`voz.md`](./voz.md) se mantiene. Faltan más ejemplos de sí para ajustes y para
el Camino. Un "Amén" o "Hoy tocan los gozosos" no rompe la regla.

---

## Qué construir primero

Distinto del ROADMAP cuando el ROADMAP choca con lo que ya existe.

1. Decisión 10 (veinte pasajes). Renombrar paquetes y repo a SanctaMaria antes de
   publicar.
2. Cerrar contenido: fuentes honestas, cláusulas ancladas o marcadas, latín cotejado (002,
   003, 021).
3. Pantalla de rezo de verdad (007).
4. Audio (008): diez clips en dispositivo, hueco medido, CarPlay encima de la mesa.
   Pre-concatenar por decena.
5. Reloj (015-017).
6. Regla y fidelidad (025-026). Después, si sigue en pie, rosas y Camino.

Fase 1 que sí es un producto: Rosario entero en español e inglés, textos en latín, una
voz, offline, sin cuenta, misterio del día, forma mexicana y romana. El sitio puede ser
una página de cómo se reza y un donar.

---

## Cómo se trabaja

- Ningún texto litúrgico de memoria. Fuente en el dato. Si no se puede anclar, queda
  pendiente.
- Nada que prometa efectos, cuantifique la gracia, culpe o compare.
- Contenido y motor: lógica pura, con pruebas. App y sitio los consumen.
- El motor produce pasos de un Rosario. Camino, rosas y Cofradía no viven en
  `sequence.ts`.
- Copy con [`voz.md`](./voz.md), en todos los idiomas activos del mismo cambio.
- Documentación en español. Código y pruebas en inglés. Commits Conventional Commits, sin
  cuerpo.
