# Task 007 - Pantalla de rezo

## Objetivo

La pantalla donde se reza: el misterio siempre visible, el texto de la oración, el avance
de las cuentas, y las formas de pasar de una a otra.

## Dependencias

- Task 005 (motor), 006 (base)

## Contexto

Es la pantalla del producto. Todo lo demás existe para llegar aquí.

Dos reglas doctrinales que se traducen en diseño:

- **Nunca hay contador sin misterio a la vista** (MC 47, RVM 12, principio 1 del plan). Ni
  siquiera en el estado más reducido.
- **Ritmo tranquilo** (RVM 12: "exige un ritmo tranquilo y un reflexivo remanso"). Nada de
  animación que empuje, ni cronómetro a la vista, ni sensación de avanzar rápido.

Y una del mercado: la queja número uno contra la app líder es que no puedes leer el texto
mientras suena. Aquí el texto está siempre.

## Qué construir

### 1. Estructura de la pantalla

- El misterio: título, imagen y, si el ajuste está activo, cita bíblica.
- El texto de la oración actual, legible a un brazo de distancia.
- Las cuentas: dónde vas en la decena, sin ocupar la pantalla.
- El paso: qué toca ahora (anuncio, Padrenuestro, Ave, Gloria).

### 2. Avanzar

- Toque en cualquier parte de la pantalla.
- Deslizar para la cuenta anterior y la siguiente.
- Botones grandes para quien no puede con los gestos.
- Automático, cuando hay audio (task 008).

### 3. Estados

Vacío no existe aquí, pero sí: cargando el contenido, sin audio descargado, sesión
retomada, terminar antes de tiempo, y volver a una sesión de otro día.

### 4. Terminar

Al acabar: qué se rezó, cuánto duró, por quién se ofreció. Sin confeti, sin puntaje. Una
línea sobria y la salida.

### 5. Salir a mitad

Se guarda solo. Al volver, la app ofrece retomar donde estaba o empezar de nuevo, sin
regañar.

## Criterios de éxito

1. El misterio es visible en todo momento durante la decena.
2. Se puede rezar el Rosario entero sin audio, solo con texto.
3. Avanzar funciona con toque, gesto y botón, y todos hacen lo mismo.
4. Salir a mitad y volver retoma la cuenta exacta.
5. Con el tamaño de fuente al máximo, la oración se lee sin recortes y sin scroll dentro
   del Ave.
6. Ninguna animación dura más de lo que tarda en leerse lo que aparece.
7. Tests cubren: avance por todos los medios, retomar sesión, cambio de misterio, y el
   recorrido completo de una decena.

## Decisiones abiertas

- Si las cuentas se representan como un rosario visual (cuentas dibujadas) o como progreso
  abstracto. Recomendación: rosario visual discreto; es la metáfora que todo el mundo
  conoce, pero no debe robarle sitio al texto.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: ya existe~~
- [ ] App
- [ ] ~~Reloj - n/a: task 016~~
- [ ] ~~Audio - n/a: task 008~~
- [ ] Accesibilidad - la pantalla se recorre entera con lector de pantalla
- [ ] ~~Sitio - n/a~~
