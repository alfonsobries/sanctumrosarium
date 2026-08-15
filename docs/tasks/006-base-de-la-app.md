# Task 006 - Base de la app

## Objetivo

Dejar la app móvil lista para construir pantallas encima: navegación, tema claro y oscuro,
idiomas, almacenamiento local, tipografía y el sistema visual mínimo.

## Dependencias

- Task 001 (para saber qué idiomas existen)

## Contexto

La app se usa de noche, en la cama, en la calle y corriendo. El modo oscuro no es una
cortesía: es el uso principal. La tipografía tiene que crecer de verdad, porque mucha
gente que reza el Rosario a diario tiene más de sesenta años.

No hay cuenta, no hay servidor, no hay pantalla de registro. Se abre y se reza.

## Qué construir

### 1. Navegación

Estructura mínima: inicio (misterio del día y empezar), rezo, ajustes. Sin barra de
pestañas llena de secciones que todavía no existen.

### 2. Tema

Claro y oscuro derivados de un solo archivo de tokens semánticos. Nada de colores sueltos
en los componentes. El oscuro se diseña primero.

### 3. Tipografía

Escala tipográfica que respeta el tamaño de fuente del sistema hasta el máximo, sin romper
el diseño. Se prueba con el ajuste al máximo desde el primer día.

### 4. Idiomas

Selección de idioma y región del contenido (lo que se reza) separada del idioma de la
interfaz. Alguien puede querer la app en español y rezar en latín. Por defecto, ambos
siguen al sistema.

### 5. Almacenamiento local

Base de datos local para el diario de rezos y los ajustes. Migraciones desde el primer
día: el diario de alguien no se pierde porque cambió una tabla.

### 6. Errores

Reporte de errores con lo mínimo. Ninguna analítica de comportamiento (decisión 14).

## Criterios de éxito

1. La app abre en la pantalla de inicio sin pedir nada.
2. Claro y oscuro completos, sin un solo color fuera de los tokens.
3. Con el tamaño de fuente del sistema al máximo, ninguna pantalla se rompe ni recorta
   texto.
4. El idioma de la interfaz y el del rezo se eligen por separado y se guardan.
5. El almacenamiento local tiene migraciones y una prueba que migra de la versión
   anterior.
6. La app funciona en avión de punta a punta.
7. Tests cubren: migraciones, selección de idioma, y que el tema no tenga colores sueltos.

## Decisiones abiertas

- Sistema de estilos (ver [`../../.agents/stack.md`](../../.agents/stack.md) cuando esté
  cerrado).

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a: esta task no toca contenido~~
- [ ] App
- [ ] ~~Reloj - n/a: la base del reloj es la task 015~~
- [ ] ~~Audio - n/a~~
- [ ] Accesibilidad - tipografía y lector de pantalla en la base, no después
- [ ] ~~Sitio - n/a~~
