---
name: contenido-liturgico
description:
  Añade o corrige contenido litúrgico (oraciones, misterios, formas regionales, cláusulas,
  letanías, meditaciones) con su fuente verificada. Usar siempre que haya que meter un
  texto nuevo al paquete de contenido, añadir un idioma o una variante regional, o revisar
  que un texto existente sea correcto.
---

# Contenido litúrgico

El contenido es el producto. Un error aquí es un error visible en la primera decena y es
lo que hunde una app de este nicho.

## La regla que define este skill

**Ningún texto se escribe de memoria, se traduce a ojo ni se genera.** Cada texto sale de
una fuente identificable y guarda esa fuente en el dato.

Orden de preferencia de fuentes:

1. `docs/referencias/rosario-doctrina.md`, que ya trae verificados los textos en latín,
   español e inglés, la estructura, las variantes regionales y las letanías.
2. La fuente primaria que ese documento cita (Compendio del Catecismo, USCCB, vatican.va,
   la conferencia episcopal del país).
3. Nada más. Si no está en ninguna de las dos, el texto **no entra**: se anota como
   pendiente en la task con lo que haría falta para conseguirlo.

## Procedimiento

1. **Localiza el texto** en el dossier. Si no está, ve a la fuente primaria y añádelo al
   dossier primero, con su URL, en el mismo cambio.
2. **Cópialo tal cual.** No se corrige la puntuación ni se moderniza la redacción de la
   fuente.
3. **Pártelo**: en líneas de rezo (por respiración, no por gramática) y en mitades de guía
   y respuesta.
4. **Rellena el dato completo**: identificador estable, idioma, variante regional, fuente
   con URL, y a qué formas regionales pertenece.
5. **Corre el validador.** Falla si falta fuente, si una forma referencia algo que no
   existe o si un idioma quedó incompleto.
6. **Léelo en voz alta** contra la pantalla, rezando. Los errores de partición solo se ven
   así.
7. Si el texto es de una región nueva, revisa que su forma completa esté representada: qué
   abre, qué se dice entre decenas y qué cierra. Una región no es un idioma.

## Al añadir un idioma

- Los textos oficiales los publica la conferencia episcopal de ese país. El Compendio del
  Catecismo los trae en varios idiomas con el latín en paralelo.
- Cuidado con los cambios recientes: el Padrenuestro francés cambió en 2017 y el italiano
  en 2020.
- Las letanías lauretanas llevan las tres invocaciones añadidas en 2020, en su posición
  exacta.
- Comprueba si la forma de ese país mete el misterio como cláusula dentro del Ave (como la
  alemana): eso cambia la estructura, no solo el texto.

## Al tocar meditaciones

Salen del magisterio o de autores en dominio público, con atribución. Nunca se escriben de
cero. Los derechos de las traducciones importan: el original de un autor del siglo XVIII
es libre, pero una traducción moderna puede no serlo.
