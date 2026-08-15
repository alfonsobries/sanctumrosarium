# Referencias técnicas

Lo verificado sobre la plataforma, con fecha y fuente. Sirve para dos cosas: elegir con
datos y **saber de antemano qué puede no funcionar**.

| Documento                            | Qué cubre                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [`apple-watch.md`](./apple-watch.md) | Target de watchOS con Expo, audio independiente, háptica, sesiones de ejercicio, complicaciones, y doce riesgos concretos |

## Pendiente de investigar

La investigación de agosto de 2026 se cortó por límite de búsquedas. Estas preguntas
siguen abiertas y bloquean las líneas sin cerrar de
[`../../../.agents/stack.md`](../../../.agents/stack.md). Cada una dice qué decidir, no
solo qué buscar.

### Audio en la app (bloquea la task 008)

- Estado de `expo-audio` frente a `expo-av` en el SDK actual: ¿cuál se usa hoy y cuál está
  deprecado?
- Controles de pantalla de bloqueo y coche: ¿los da `expo-audio` o hace falta
  `react-native-track-player`? Estado de ese paquete con la nueva arquitectura.
- Encadenar decenas de pistas cortas sin silencio audible entre ellas: qué API lo permite
  sin cortes con auriculares Bluetooth.
- Formato y tamaño: qué códec y qué tasa dan el paquete más chico que suene bien con voz
  hablada, para unos cuarenta minutos por idioma.
- Mezcla de voz y música de fondo con atenuación.

### Sincronización texto y audio (bloquea la task 009)

- Qué herramienta de alineación forzada conviene para español y latín, y qué precisión da
  por palabra.
- Formato de las marcas de tiempo y cómo se versionan junto al audio.

### Voces (bloquea la decisión 5 y la task 022)

- Qué proveedor de síntesis, si alguno, pronuncia latín eclesiástico de forma aceptable, y
  qué trucos usa la gente (escribirlo fonéticamente, usar una voz italiana con texto
  latino).
- Licencia de uso comercial de las voces sintetizadas.
- Costo aproximado de locución humana por idioma, y si vale pedir el latín a un seminario.

### Responder hablando (bloquea la task 024 y la decisión 7)

- Estado del reconocimiento de voz en el dispositivo con Expo, y qué idiomas cubre.
- Detección de actividad de voz por energía como alternativa que funcione también en
  latín: librerías, latencia y consumo.

### Recogimiento (bloquea la task 038)

- Librería de Salud para React Native que esté viva y funcione con la nueva arquitectura.
- Cómo se escribe una sesión de atención plena, y qué se puede leer de frecuencia cardiaca
  y variabilidad durante el rezo.
- Equivalente en Android.

### Resto del stack

- Sistema de estilos para la app.
- Almacenamiento local del diario con migraciones.
- Internacionalización de la interfaz.
- Widgets y actividades en vivo en el SDK actual.

### Sitio y dinero (bloquea la task 013 y la decisión 3)

- Enrutado de idioma, colecciones de contenido y despliegue en la versión actual de Astro.
  Lo que ya está montado usa el enrutado nativo y funciona, pero no se contrastó con la
  documentación.
- Reglas actuales de las tiendas sobre propinas y donativos para un desarrollador
  individual, y si se puede enlazar al sitio desde la app.
- Comisiones reales de cada forma de recibir donativos desde México.

### Contenido y derechos (bloquea la task 003 y la decisión 10)

- Qué traducción bíblica se puede usar por idioma, con su licencia y su costo si lo tiene.
- Fuentes de arte sacro en dominio público, y reglas de atribución de cada museo.
- Grabaciones de canto gregoriano con licencia usable: el canto es de dominio público, la
  grabación no siempre.
