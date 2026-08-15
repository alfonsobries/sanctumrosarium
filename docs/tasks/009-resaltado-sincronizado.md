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
