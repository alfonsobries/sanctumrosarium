# Task 026 - Fidelidad del mes

## Objetivo

Ver la constancia como un calendario que se llena, no como una racha que se rompe.

## Dependencias

- Task 025

## Contexto

Las rachas funcionan y por eso todo el mundo las usa. También son la crítica más citada
contra las apps de oración, y hay literatura católica seria sobre lo que le hacen a una
persona escrupulosa: medir la propia santidad por si dijiste el rosario hoy.

La salida no es quitar el seguimiento, es cambiar la unidad: **días fieles**, no días
seguidos. Un hueco es un hueco, no una pérdida. Detalle en
[`../gamificacion.md`](../gamificacion.md), sección 2.

## Qué construir

### 1. El calendario

El mes en curso, con los días fieles a la Regla marcados, y una línea sobria: "22 de 31
días". Sin número de racha grande.

### 2. Los huecos

Un día sin rezar deja el día vacío. Nada rojo, nada de animación de derrota, nada de
mensajes.

### 3. Modo pausa

Enfermedad, viaje, luto. Los días en pausa no cuentan como huecos y no piden explicación.

### 4. Volver

Al abrir la app tras faltar, la pantalla es la de siempre: el misterio de hoy. Ninguna
referencia a lo que no se hizo.

### 5. Historia

Meses anteriores consultables. Es historia, no deuda: no se suman, no se comparan, no se
felicitan.

## Criterios de éxito

1. La pantalla principal enseña el mes y los días fieles, sin número de racha destacado.
2. Faltar un día no produce ningún mensaje, notificación ni cambio de tono.
3. El modo pausa existe y se activa en un toque.
4. Los meses anteriores se consultan y no se comparan entre sí.
5. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`, y queda anotado en la
   task.
6. Tests cubren: cálculo de días fieles con cada tipo de Regla, cambio de mes, zona
   horaria, y días en pausa.

## Decisiones tomadas (primera pasada, agosto 2026)

- **La regla semanal se enseña por semanas** (lunes a domingo): la unidad de la vista
  sigue a la unidad de la Regla, como recomendaba la spec.
- **El calendario son marcas, no números**: día fiel relleno, hueco en contorno (sin rojo,
  sin animación), día en pausa con forma distinta (guion), futuro invisible. La
  información nunca depende solo del color.
- **Pausa** en la pantalla de Fidelidad, un toque, sin preguntar por qué; los días en
  pausa quedan guardados como rangos en el diario (migración v2 probada, incluida la
  subida desde v1 sin perder lo rezado).
- **Volver tras faltar**: no existe ningún copy de vuelta; la pantalla es la de siempre.
  El criterio se cumple por ausencia.
- **Historia**: hasta doce meses anteriores, cada uno con su cuadrícula y su línea, sin
  sumas ni comparaciones.
- **Un día con menos decenas que la Regla queda como hueco**, nunca crédito parcial
  (probado).
- **Prueba de las cinco preguntas** (docs/gamificacion.md), pasada sobre la pantalla: (1)
  sin ansiedad añadida: los huecos son contornos neutros y la pausa existe; (2) nada liga
  cantidad con protección; (3) todos los números son actos (días, semanas, decenas); (4)
  no hay comparación con nadie; (5) sin Regla, la pantalla lo dice en una línea y la app
  queda completa.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - cálculo puro de fidelidad con tests (reglas diarias, semanal,
      cambio de mes, pausa, fecha local)
- [x] App
- [ ] Reloj - avance del día cuando exista (task 015)
- [x] ~~Audio - n/a~~
- [ ] Accesibilidad - la cuadrícula es decorativa y la línea lleva la cuenta; recorrido
      con lector en aparato pendiente
- [x] ~~Sitio - n/a~~
