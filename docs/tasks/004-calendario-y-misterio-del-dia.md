# Task 004 - Calendario y misterio del día

## Objetivo

Saber qué misterio toca hoy, con la regla de la semana y las excepciones del tiempo
litúrgico, y poder elegir otro sin pelear con la app.

## Dependencias

- Task 003

## Contexto

La distribución semanal es la de RVM 38: lunes y sábado gozosos, jueves luminosos, martes
y viernes dolorosos, miércoles y domingo gloriosos. Pero el Directorio (DPPL 200) advierte
que aplicarla con rigidez produce disparates, y da el ejemplo: rezar misterios dolorosos
el día de Navidad porque cae en viernes. La costumbre extendida, que recoge la USCCB: los
domingos de Adviento y Navidad, gozosos; los domingos de Cuaresma, dolorosos.

Esto es exactamente el tipo de detalle que separa una app hecha por alguien que reza de
una hecha por alguien que copió una tabla.

## Qué construir

### 1. Regla semanal

Función pura: dado un día, devuelve el ciclo de misterios que toca, con la regla de
RVM 38.

### 2. Tiempo litúrgico

Cálculo del tiempo litúrgico del día (Adviento, Navidad, Cuaresma, Pascua, tiempo
ordinario) a partir de la fecha de Pascua. Sin depender de red ni de una tabla que
caduque.

### 3. Excepciones

- Domingos de Adviento y Navidad: gozosos.
- Domingos de Cuaresma: dolorosos.
- Solemnidades donde la costumbre sugiere otra cosa (Epifanía con los gozosos y la
  adoración de los Magos como quinto misterio, según DPPL 200).

Cada excepción se aplica **como sugerencia visible**, con una línea que explica por qué
("Hoy es domingo de Cuaresma: la costumbre reza los dolorosos"), nunca como imposición
silenciosa.

### 4. Esquema anterior a 2002

Ajuste para quien reza sin misterios luminosos: gozosos lunes y jueves, dolorosos martes y
viernes, gloriosos miércoles, sábado y domingo.

### 5. Elegir otro

Cambiar de ciclo cuesta un toque desde la pantalla de inicio, sin advertencias ni
fricción.

## Criterios de éxito

1. Para cualquier fecha, la app dice qué ciclo toca y por qué.
2. El tiempo litúrgico se calcula bien, incluida la fecha de Pascua, para al menos los
   años 2020-2050 verificados contra una fuente.
3. Las excepciones se muestran como sugerencia con explicación, y se pueden ignorar.
4. El esquema anterior a 2002 es un ajuste que funciona.
5. Tests cubren: los siete días, las cuatro estaciones litúrgicas, Navidad en viernes,
   Epifanía, domingos de Cuaresma y Adviento, y el esquema de quince misterios.

## Decisiones abiertas

- Si el calendario incluye las fiestas marianas (7 de octubre, Fátima, Lourdes, Guadalupe)
  para sugerir el Rosario ese día con una nota. Recomendación: sí, es catequesis barata y
  bienvenida.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App - la sugerencia y el selector viven en la pantalla de inicio (task 007)
- [ ] Reloj - la complicación muestra el misterio del día (task 019)
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - la explicación de la sugerencia se lee con el lector de pantalla
- [ ] ~~Sitio - n/a: el sitio muestra el misterio del día en la 013~~

## Fuentes

- RVM 38; DPPL 200; USCCB "How to Pray the Rosary"
- Dossier, C.1 y C.2

## Primera pasada (agosto 2026)

Hecho:

- Cálculo de Pascua, tiempo litúrgico y misterio del día en
  `packages/engine/src/calendar.ts`, con la regla de RVM 38, las excepciones de los
  domingos de Adviento, Navidad y Cuaresma, y el esquema anterior a 2002.
- La razón de la sugerencia viaja en el dato (`reason: 'weekday' | 'season'`) para que la
  app la muestre en vez de cambiar en silencio.
- Pascua verificada contra fechas reales de once años entre 2020 y 2050.

Pendiente:

- La excepción de Epifanía (misterios gozosos con la adoración de los Magos como quinto
  misterio).
- Fiestas marianas.
- Selector de otro ciclo en la interfaz.
