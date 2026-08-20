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

## Decisiones tomadas (primera pasada, agosto 2026)

- **Suelo mínimo por Ave** en modo automático (12 s entre voz y silencio), probado. Es
  piso, nunca techo: no existe control que lo baje.
- **Solo hacia despacio**: la velocidad ofrece paso normal o más pausado; no hay modo
  rápido ni opción que lo insinúe (criterio 2 por construcción).
- **Silencio para responder** natural o más largo; **pausa en el misterio** breve, media o
  larga (ajustes v11, migración probada). El guía respeta siempre el silencio de respuesta
  (probado).
- Esto cierra también el "ritmo y voz" que la task 011 dejó pendiente.
- **Pausas internas de Montfort** (dentro del Padrenuestro y el Ave): pospuestas a la
  etapa de meditar (032/034), que es quien debe sugerirlas una vez; requieren cortes de
  audio propios.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - plan de audio con suelo y pausas, con tests
- [x] App
- [x] ~~Reloj - el ritmo se hereda; no se configura ahí~~
- [x] Audio - los defaults del guía son los del ritmo tranquilo
- [x] Accesibilidad - filas de selección normales
- [x] ~~Sitio - n/a~~

## Fuentes

- MC 47; RVM 12; Montfort Rosa 44; dossier C.5.3
