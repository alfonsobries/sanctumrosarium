# Task 003 - Los veinte misterios

## Objetivo

El contenido de los veinte misterios: título, cita bíblica con su texto, fruto, meditación
breve e imagen, en cada idioma.

## Dependencias

- Task 001, 002

## Contexto

El misterio es el Rosario. Sin él "es un cuerpo sin alma" (MC 47). La app nunca muestra un
contador sin su misterio, así que este contenido aparece en todas las pantallas de rezo,
en el reloj y en el sitio.

Los cuatro ciclos, sus citas, sus frutos y una línea de meditación por misterio están en
el dossier ([`../referencias/rosario-doctrina.md`](../referencias/rosario-doctrina.md),
sección C.3). Los frutos no están fijados por el magisterio: son tradición catequética y
varían por país, así que el modelo guarda el fruto principal y permite el de la tradición
local.

## Qué construir

### 1. Los cuatro ciclos

Gozosos, luminosos, dolorosos, gloriosos, cada uno con sus cinco misterios en orden, con
título por idioma y variante (el mismo misterio se llama distinto en México y en España).

### 2. Cita bíblica

Referencia (libro, capítulo, versículos) y el texto en cada idioma. **El texto depende de
la traducción y de sus derechos**: la decisión 10 de
[`../DECISIONES.md`](../DECISIONES.md) define qué traducción se usa por idioma. Mientras
no esté cerrada, el modelo guarda la referencia y el texto queda vacío: la app puede
mostrar la referencia sin la cita.

### 3. Fruto

Fruto principal por misterio, y fruto alternativo de la tradición hispana donde difiere.
Los luminosos no tienen frutos antiguos: se usan los más difundidos, marcados como tales.

### 4. Meditación breve

Dos o tres líneas por misterio, para leer antes de la decena. Salen del magisterio (RVM 20
a 23) o de autores en dominio público, con atribución. **No se escriben de cero ni se
generan**: se citan.

### 5. Imagen

Una obra de arte sacro por misterio, en dominio público, con ficha (autor, año, museo,
licencia). La curaduría es parte de la task: no vale la primera imagen que aparezca.

### 6. Cláusulas

La frase que se añade tras el nombre de Jesús en cada decena, por misterio. Las oficiales
alemanas y la lista de Montfort están en el dossier; se guardan por idioma.

## Criterios de éxito

1. Los veinte misterios existen en los cuatro idiomas, con título, referencia bíblica,
   fruto y meditación con atribución.
2. Cada misterio tiene su imagen de dominio público con ficha completa.
3. Cada misterio tiene su cláusula.
4. Ninguna meditación es texto inventado: todas citan autor y obra.
5. El validador falla si un misterio no tiene imagen, fruto o atribución.
6. Tests cubren: veinte misterios exactos, cinco por ciclo, orden estable, todos los
   idiomas.

## Decisiones abiertas

- Traducción bíblica por idioma (decisión 10).
- Si la meditación puede ser distinta por idioma (un texto de Montfort en español y otro
  de RVM en inglés) o debe ser la misma traducida.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] ~~App - n/a: se consume en la 007~~
- [ ] ~~Reloj - n/a~~
- [ ] ~~Audio - n/a~~
- [ ] ~~Accesibilidad - n/a~~
- [ ] Sitio - los misterios son contenido indexable del sitio (task 013)

## Fuentes

- Dossier, C.3 (tabla de los veinte misterios con día, cita, fruto y meditación)
- RVM 19 a 25 para los luminosos y el sentido de cada ciclo
- Colecciones de dominio público de museos abiertos para las imágenes

## Primera pasada (agosto 2026)

Hecho:

- Los veinte misterios con título en español, inglés y latín, referencia bíblica, fruto,
  cláusula y meditación breve en español.

Pendiente:

- Texto de la cita bíblica: depende de la decisión 10 (traducción y licencia por idioma).
- Meditaciones en inglés y latín, con atribución.
- Imágenes: falta la curaduría entera y su ficha.
