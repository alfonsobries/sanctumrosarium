# Task 009 - Resaltado sincronizado

## Objetivo

Que el texto se ilumine al ritmo del audio, línea a línea o palabra a palabra, para poder
seguir la oración con la vista mientras se reza en voz alta.

## Dependencias

- Task 008

## Contexto

Es la respuesta directa a la queja número uno contra la app líder del nicho ("no hay forma
de leer la oración mientras se dice") y lo que hace que el modo latín sirva para aprender:
ver qué palabra suena.

## Qué construir

### 1. Marcas de tiempo

Cada pista de audio trae sus marcas: en qué milisegundo empieza cada línea y, donde se
pueda, cada palabra. Se generan con alineación automática y se revisan a mano en las
oraciones cortas, que son las que más se repiten.

### 2. Formato

Las marcas viven junto al audio, en un formato simple y versionado. Si faltan, el texto se
muestra sin resaltado: nunca es un error fatal.

### 3. Resaltado

Suave, sin saltos bruscos, sin animación que distraiga. La línea actual siempre visible
sin que el usuario tenga que hacer scroll.

### 4. Velocidad

Al cambiar la velocidad de reproducción, el resaltado sigue cuadrando.

## Criterios de éxito

1. En las oraciones del Rosario, el resaltado va con la voz, sin adelantarse ni retrasarse
   de forma perceptible.
2. Sin marcas de tiempo, la pantalla funciona igual, sin resaltado.
3. A velocidad distinta de la normal, el resaltado sigue cuadrado.
4. El texto se desplaza solo, sin robar el control al usuario si él lo mueve.
5. Tests cubren: interpolación de marcas, ausencia de marcas, cambio de velocidad.

## Decisiones abiertas

- Palabra o línea. Recomendación: línea por defecto, palabra en el modo de aprendizaje del
  latín, donde sí aporta.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] ~~Contenido y motor - n/a~~
- [ ] App
- [ ] ~~Reloj - n/a: en el reloj no se lee, se escucha~~
- [ ] Audio - las marcas son parte del empaquetado de audio
- [ ] Accesibilidad - el resaltado no interfiere con el lector de pantalla ni depende solo
      del color
- [ ] ~~Sitio - n/a~~

## Decisiones tomadas (primera pasada, agosto 2026)

- **Marcas por línea**, no por palabra todavía: la alineación viene del proveedor de la
  voz (carácter a carácter) y se reduce a inicio/fin de cada línea. Palabra a palabra
  queda para cuando la voz sea definitiva.
- **Formato**: las marcas viven en el manifiesto del paquete de audio
  (`lines: [{startMs, endMs}]` por mitad), versionado junto al audio. Sin marcas, el texto
  se muestra sin resaltado (probado).
- **Resaltado**: la línea que suena en color pleno y el resto atenuado; sin animación.
  Nunca se adelanta: nada se ilumina antes de que suene y entre líneas se sostiene la
  anterior.
- **Velocidad**: las marcas están en tiempo de pista, así que otra velocidad no necesita
  corrección (la posición avanza en ese mismo reloj).
- **Desplazamiento**: la línea activa se mantiene a la vista; si la persona mueve el
  scroll, la app deja de seguirla unos segundos.
- **Revisión a oído de las oraciones cortas**: pendiente, junto con la decisión de voz (el
  andamio sintetizado se revisará al grabar la voz real).

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a~~
- [x] App
- [x] ~~Reloj - n/a~~
- [x] Audio - marcas generadas con el paquete andamio
- [ ] Accesibilidad - el resaltado es solo visual y no cambia el orden de lectura;
      verificación con VoiceOver en aparato pendiente
- [x] ~~Sitio - n/a~~
