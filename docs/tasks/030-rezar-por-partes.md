# Task 030 - Rezar por partes

## Objetivo

Poder rezar una decena ahora y otra después, sin perder el hilo, y saber qué implica para
la indulgencia.

## Dependencias

- Task 005, 007

## Contexto

Es práctica tradicional y recomendada: Montfort aconseja dividir las quince decenas en
tres momentos del día y rezar "una decena aquí y otra allá" cuando no hay más remedio.

Pero hay un matiz que la app tiene que decir bien: la indulgencia plenaria pide **cinco
decenas seguidas**. Rezar por partes es bueno y es oración; simplemente no cumple esa
condición concreta. Decirlo con precisión es doctrina; insinuar que "no vale" sería falso
y cruel.

## Qué construir

### 1. Guardar y retomar

Salir a mitad guarda la cuenta exacta. Al volver, retomar o empezar de nuevo, sin regaño.

### 2. Sesión abierta

Una sesión a medias sigue viva durante el día. Al día siguiente se pregunta si se retoma o
se cierra.

### 3. La nota sobre la indulgencia

Cuando alguien reza por partes, una línea explica, una sola vez y sin repetirla cada día,
que la indulgencia plenaria requiere las cinco decenas seguidas, con las demás
condiciones. Con enlace a la explicación completa.

### 4. Contar para la Regla

Las decenas sueltas cuentan para la Regla que las mida en decenas. Para una Regla de
"cinco decenas al día", cinco decenas sueltas cuentan como cumplida: la Regla mide
fidelidad, no continuidad.

## Criterios de éxito

1. Salir y volver retoma la cuenta exacta, incluso al día siguiente.
2. La nota sobre la indulgencia es exacta, aparece una vez y no culpabiliza.
3. Las decenas sueltas cuentan para la Regla.
4. Tests cubren: retomar desde cada tipo de paso, sesión de ayer, y el conteo para cada
   Regla.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - una decena suelta en el reloj es un caso principal, no un extra
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] Sitio - la explicación completa de la indulgencia vive en el sitio

## Fuentes

- Dossier, A.8 (Enchiridion Indulgentiarum, concesión 17 y norma 6) y C.5
