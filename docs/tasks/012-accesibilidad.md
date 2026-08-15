# Task 012 - Accesibilidad

## Objetivo

Que la app sirva a quien más reza el Rosario: gente mayor, gente que no ve bien, gente que
reza a oscuras o sin manos.

## Dependencias

- Task 007, 008, 010

## Contexto

Esto no es una casilla legal: la mitad de la feligresía que reza el Rosario a diario tiene
más de sesenta años. Una app de oración que no se puede leer con letra grande es una app
que no sirve para su usuario principal.

Va como task propia porque hay un momento en que se revisa todo junto y se cierra, además
de ser estándar en cada pantalla.

## Qué construir

### 1. Lector de pantalla

La pantalla de rezo entera se recorre con VoiceOver y TalkBack: se sabe qué misterio es,
qué oración toca, en qué cuenta se va, y se puede avanzar. El audio de la app y el lector
no se pelean.

### 2. Tipografía

Todo el texto crece hasta el máximo del sistema sin recortes, sin scroll dentro de una
oración corta y sin romper el diseño.

### 3. Contraste y color

Contraste verificado en claro y oscuro. Ninguna información depende solo del color (el
resaltado del texto también cambia de peso o fondo).

### 4. Toque

Objetivos táctiles grandes. Avanzar nunca depende de acertar a un botón chico.

### 5. Movimiento

Respeta "reducir movimiento": sin transiciones que se muevan cuando el sistema lo pide.

### 6. Sin manos

El rezo se puede llevar entero desde los controles de auriculares y la pantalla de bloqueo
(la implementación es la task 020; aquí se verifica el recorrido completo).

## Criterios de éxito

1. Un Rosario completo se reza con VoiceOver activado, sin ver la pantalla, y se entiende
   dónde se va en todo momento.
2. Con el tamaño de fuente al máximo, ninguna pantalla recorta ni superpone texto.
3. El contraste cumple en claro y oscuro, verificado con herramienta, no a ojo.
4. Con "reducir movimiento" activo no hay animaciones de desplazamiento.
5. Todos los objetivos táctiles cumplen el tamaño mínimo recomendado.
6. La revisión se hizo en un dispositivo real, no en el simulador, y quedó anotada en la
   task.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App
- [ ] Reloj - el reloj también se revisa con lector de pantalla
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad
- [ ] Sitio - el sitio se revisa con los mismos criterios
