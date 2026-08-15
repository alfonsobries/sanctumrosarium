# Task 025 - La Regla

## Objetivo

Que cada quien fije a qué se compromete, lo pueda bajar cuando quiera, y la app nunca se
lo suba sola.

## Dependencias

- Task 006

## Contexto

Es la pieza central de la constancia y la más delicada del producto. El modelo no lo
inventamos: la Cofradía del Rosario obliga a quince decenas semanales desde el siglo XV y
dice, con esas palabras, que **no obliga bajo pecado**; las asociaciones marianas
contemporáneas repiten la misma fórmula y añaden que fallar unos días no te saca de nada.

Eso es lo que hay que copiar: una norma clara, elegida por el usuario, sin castigo.

El diseño completo está en [`../gamificacion.md`](../gamificacion.md), sección 1.

## Qué construir

### 1. Elegir la Regla

Al empezar o desde ajustes: una decena al día, cinco decenas al día, quince decenas por
semana (la de la Cofradía), el Rosario completo, o sin regla.

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

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - el reloj enseña el avance de la Regla, no la configura
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] ~~Sitio - n/a~~
