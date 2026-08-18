# Task 035 - Ritmo y pausas

## Objetivo

Rezar despacio por defecto: tiempo por Ave, pausas dentro de las oraciones, silencio entre
decenas.

## Dependencias

- Task 011, 008

## Contexto

"Por su naturaleza el rezo del Rosario exige un ritmo tranquilo y un reflexivo remanso"
(MC 47; RVM 12). Montfort marca pausas dentro del Padrenuestro y del Ave (Rosa 44) y
condena acabar cuanto antes.

La 011 ya tiene velocidad y silencio de respuesta. Esta task es el producto de atención,
no otro slider: el ritmo lento es el modo normal, no un extra.

## Qué construir

### 1. Tiempo por Ave

Un suelo mínimo cuando hay audio automático. No hay premio por ir más rápido. No hay "modo
rápido".

### 2. Pausas internas

Opcionales, al estilo de Montfort, en el Padrenuestro y el Ave. Apagadas por defecto para
no sorprender; la etapa de meditar puede sugerirlas una vez.

### 3. Entre decenas

Un silencio corto y configurable al cambiar de misterio.

## Criterios de éxito

1. El valor por defecto no apura.
2. No existe ningún control que premie la velocidad.
3. Las pausas se pueden apagar todas de una vez.
4. Tests cubren: el suelo mínimo, silencio entre decenas, y que el modo automático no
   salte el silencio de respuesta.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - el ritmo se hereda; no se configura ahí
- [ ] Audio
- [ ] Accesibilidad
- [ ] ~~Sitio - n/a~~

## Fuentes

- MC 47; RVM 12; Montfort Rosa 44; dossier C.5.3
