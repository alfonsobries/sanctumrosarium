# Task 033 - Cláusulas

## Objetivo

Añadir, tras el nombre de Jesús en cada Ave, la frase del misterio que se está meditando.

## Dependencias

- Task 031, 003, 011

## Contexto

Pablo VI (MC 46) y Juan Pablo II (RVM 33) recuerdan la costumbre. El Directorio la pide de
vuelta: "una cláusula correcta, fija para cada decena, breve, fiel a la Escritura y a la
Liturgia" (DPPL 201). En alemán es la forma oficial, no un adorno.

El paquete de contenido ya guarda una cláusula por misterio en español, inglés y latín. La
003 anotó que esa redacción no está anclada a una fuente de cada lengua: son patrón alemán
y lista de Montfort (Rosa 50), escritos de nuevo. Esta task no las publica hasta
cotejarlas o marcarlas como versión propia.

El motor ya tiene `withClauses` y no lo usa. Aquí se enciende.

## Qué construir

### 1. El dato

Cada cláusula con su fuente. Si no hay texto oficial en esa lengua, se usa el patrón
alemán del Gotteslob o la lista de Montfort y se dice cuál.

### 2. En el Ave

Tras "Jesús" / "Jesus" / "Iesus", la frase del misterio. El corte de llamada y respuesta
sigue funcionando.

### 3. Ajuste

Apagadas por defecto, salvo en la forma alemana cuando exista (task 042). La etapa 3 del
Camino las enciende.

## Criterios de éxito

1. Con el ajuste on, las diez Aves de cada decena llevan la cláusula de ese misterio.
2. Con el ajuste off, el Ave es el texto de siempre.
3. Ninguna cláusula se presenta como cita del magisterio si es redacción propia.
4. Tests cubren: las veinte cláusulas, el motor las inserta, y el Ave sin cláusula no
   cambia.

## Ciclo completo

- [ ] Definir qué aplica
- [ ] Contenido y motor
- [ ] App
- [ ] Reloj - si suena o se cuenta, la cláusula no hace falta en pantalla
- [ ] Audio - hay que grabar el Ave con cada cláusula, o decirla el guía al anunciar
- [ ] Accesibilidad
- [ ] Sitio - la guía explica qué es y cita DPPL 201

## Fuentes

- DPPL 201; RVM 33; MC 46; Gotteslob 4; Montfort Rosa 50; dossier C.2 (Alemania) y C.5.12
