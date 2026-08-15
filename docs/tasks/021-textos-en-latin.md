# Task 021 - Textos en latín

## Objetivo

Que se pueda rezar el Rosario entero en latín: todas las oraciones, las letanías y los
títulos de los misterios, con la forma que corresponde.

## Dependencias

- Task 001, 002

## Contexto

El latín es el mayor diferenciador del producto. En el mercado existe como texto en varias
apps y como audio digno en una sola, y en ninguna como algo que se pueda aprender
([`../../competencia/referentes-ux.md`](../../competencia/referentes-ux.md)).

Los textos latinos verificados están en el dossier, sección C.4, y ya están levantados en
el paquete de contenido: señal de la cruz, Credo, Padrenuestro, Avemaría, Gloria, oración
de Fátima, Salve, oración final, Bajo tu amparo, San Miguel, el versículo del salmo 69 y
las letanías completas.

Esta task cierra lo que falta para que el latín sea un idioma de primera y no una
curiosidad.

## Qué construir

### 1. Lo que falta del contenido

- Títulos de los misterios en latín, ya presentes, revisados por alguien que sepa latín.
- Cláusulas latinas por misterio (ya levantadas, sin revisar).
- La forma dominicana en latín como forma por defecto para este idioma.

### 2. La interfaz en latín

El idioma del rezo puede ser latín con la interfaz en español o en inglés. **La interfaz
nunca se traduce al latín**: no existe copy litúrgico para "ajustes" ni para "empezar".

### 3. Mezcla

Poder rezar unas oraciones en latín y otras en el idioma propio: es lo que hace mucha
gente cuando está aprendiendo. Por oración, no todo o nada.

### 4. Pronunciación

Nota corta sobre la pronunciación eclesiástica, donde se pueda consultar sin estorbar.

## Criterios de éxito

1. Se reza el Rosario completo en latín, con las letanías, sin que falte ni sobre nada.
2. Alguien que sabe latín revisó los textos y las cláusulas.
3. La mezcla por oración funciona y se guarda.
4. La interfaz sigue en el idioma del usuario cuando el rezo es en latín.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj
- [ ] ~~Audio - n/a: el audio en latín es la task 022~~
- [ ] Accesibilidad - el lector de pantalla leerá latín como si fuera el idioma del
      sistema; hay que marcarlo para que no lo destroce
- [ ] Sitio - la guía del sitio incluye la versión latina
