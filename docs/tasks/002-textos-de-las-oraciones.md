# Task 002 - Textos de las oraciones

## Objetivo

Levantar los textos de todas las oraciones del Rosario en español (México y España),
inglés y latín, con su fuente verificada, partidos en líneas y en mitades de guía y
respuesta.

## Dependencias

- Task 001 (el modelo donde viven)

## Contexto

Esta es la task más aburrida y la más importante. Un acento mal puesto en un Avemaría se
nota; una oración con la redacción de otro país se nota más. La forma mexicana dice "Dios
te salve, María Santísima, Hija de Dios Padre" al final y la española remata distinto; el
Padrenuestro francés cambió en 2017 y el italiano en 2020.

Los textos completos en latín, español e inglés ya están transcritos y verificados en el
dossier ([`../referencias/rosario-doctrina.md`](../referencias/rosario-doctrina.md),
sección C.4). Esta task los pasa al paquete, los parte y los prueba.

## Qué construir

### 1. Transcripción

Cada oración, en cada idioma y variante, copiada de su fuente sin "mejorar" la redacción.
Se conserva la puntuación de la fuente.

### 2. Partición en líneas

Cada oración partida en líneas de rezo: las que se muestran juntas en pantalla y las que
el audio dice de corrido. No es partición por frase gramatical, es por respiración.

### 3. Partición guía y respuesta

El punto exacto donde se corta cada oración cuando se reza a dos voces. Los cortes
tradicionales:

- Avemaría: guía hasta "...Jesús"; respuesta desde "Santa María".
- Padrenuestro: guía hasta "...así en la tierra como en el cielo"; respuesta desde "Danos
  hoy" (uso común en el rezo a dos coros; verificar con la forma de cada región).
- Gloria: guía hasta "...Espíritu Santo"; respuesta desde "Como era en el principio".
- Salve y letanías: versículo y respuesta ya vienen marcados por su propia forma.

### 4. Fuente por texto

Cada versión guarda de dónde salió, con URL. Sin fuente, el validador de la task 001 la
rechaza.

### 5. Revisión humana

Antes de cerrar la task, alguien que reza el Rosario en cada idioma lee los textos en voz
alta contra la pantalla. No es opcional y no lo sustituye ninguna prueba automática.

## Criterios de éxito

1. Las oraciones de la estructura completa existen en `es-MX`, `es-ES`, `en-US` y `la`.
2. Cada una tiene fuente con URL.
3. Cada una está partida en líneas y en mitades de guía y respuesta.
4. Las letanías lauretanas están completas en los cuatro idiomas, con las invocaciones
   de 2020.
5. Los textos propios de la forma mexicana y de la española están, y no se mezclan entre
   sí.
6. Alguien rezó el Rosario entero leyendo de la app en cada idioma antes de cerrar la
   task.
7. Tests cubren: presencia de cada oración por idioma, partición no vacía, fuente
   presente.

## Decisiones abiertas

- Si el inglés incluye además la forma tradicional del Credo ("I believe in God the Father
  almighty...") como variante, o solo la actual de la USCCB.
- Si se añade el portugués desde ya (la oración de Fátima en su idioma original tiene
  valor).

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] ~~App - n/a: la pantalla llega en la 007~~
- [ ] ~~Reloj - n/a~~
- [ ] ~~Audio - n/a: task 008~~
- [ ] ~~Accesibilidad - n/a: sin interfaz~~
- [ ] Sitio - los textos alimentan la sección "cómo se reza" en la task 013

## Fuentes

- Dossier, C.4 (textos completos en latín, español e inglés, ya verificados)
- Compendio del Catecismo (multilingüe, con latín en paralelo)
- USCCB para el inglés; Arquidiócesis de México y dominicos para las formas hispanas

## Primera pasada (agosto 2026)

Hecho:

- Oraciones de la estructura completa en `es-MX`, `es-ES`, `en-US` y `la`, con fuente y
  partidas en líneas y en mitades de guía y respuesta.
- Las piezas propias de la forma mexicana (por la señal, acto de contrición, jaculatoria,
  las tres "Dios te salve, María Santísima", templo y sagrario) y de la española
  (versículo de apertura, ofrecimiento, Ave María Purísima).

Pendiente:

- Letanías lauretanas completas en los cuatro idiomas.
- **La revisión humana no se ha hecho.** Nadie ha rezado todavía el Rosario leyendo de la
  app en cada idioma. La task no se cierra sin eso.
