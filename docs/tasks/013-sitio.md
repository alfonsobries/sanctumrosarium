# Task 013 - Sitio

## Objetivo

El sitio en Astro: qué es la app, cómo se reza el Rosario (contenido real, no relleno), y
dónde donar.

## Dependencias

- Task 001, 003 (el sitio consume el mismo contenido que la app)

## Contexto

El sitio hace tres cosas, en este orden de importancia:

1. **Enseñar a rezar el Rosario.** Es contenido que la gente busca, que nadie tiene bien
   hecho en español, y que la app respalda. Es la razón por la que alguien llega.
2. **Explicar la app** y llevar a las tiendas.
3. **Recibir donativos**, sin presión y sin pedir nada a cambio.

El contenido sale del mismo paquete que la app: si un texto cambia, cambia en los dos
lados.

## Qué construir

### 1. Estructura

- Inicio: qué es, para quién, y las capturas reales.
- Cómo se reza el Rosario: la guía completa, con la estructura, los misterios del día, los
  textos y las variantes por región.
- Los veinte misterios: una página por misterio con su cita, su fruto, su meditación y su
  obra de arte.
- Preguntas: indulgencias y sus condiciones reales, las quince promesas y su estatus, por
  qué la app no promete nada.
- Donar.
- Aviso de privacidad, escrito en cristiano: no se recoge nada.

### 2. Multiidioma

Español e inglés desde el inicio, con la estructura preparada para los demás. Cada idioma
con su URL y sus etiquetas de idioma alternativo bien puestas.

### 3. Contenido compartido

El sitio lee el paquete de contenido. Nada de textos copiados a mano.

### 4. Donativos

Un método, claro, sin insistencia, sin barra de meta ni contador. Cuál, en la decisión 3
de [`../DECISIONES.md`](../DECISIONES.md).

### 5. Estático y rápido

Sitio estático, sin analítica de comportamiento, sin fuentes externas, sin scripts de
terceros.

## Criterios de éxito

1. La guía de cómo se reza está completa y es correcta, con las variantes regionales.
2. Los textos vienen del paquete de contenido, no copiados.
3. Español e inglés completos, con enlaces de idioma alternativo correctos.
4. El sitio carga sin scripts de terceros y sin peticiones a otros dominios.
5. Donar cuesta dos clics desde el inicio y no aparece en ningún otro sitio de forma
   insistente.
6. Las páginas pasan la revisión de accesibilidad de la task 012.

## Decisiones abiertas

- Si el sitio permite rezar en el navegador. Recomendación: no en la primera versión; el
  navegador no sostiene bien el audio en segundo plano y la promesa se rompería. Revisarlo
  con lo que diga [`../referencias/tecnica/`](../referencias/tecnica/).

## Decisiones tomadas (primera pasada, agosto 2026)

- El sitio quedó construido con inicio, cómo se reza, oraciones, misterios, funciones,
  cómo está hecha, privacidad, apoyar y 404, en español e inglés, leyendo el paquete de
  contenido.
- **Preguntas**: página nueva con las indulgencias y sus condiciones reales, el estatus de
  las quince promesas y por qué la app no promete nada. Escrita contra el dossier
  doctrinal, revisada por el revisor doctrinal (3 bloqueantes corregidos: margen de las
  tres condiciones, "a modo de sufragio", y sacramentales que disponen sin conferir).
- **El texto de las quince promesas no se reproduce todavía**: la versión española citable
  completa llega con la escuela del Rosario (task 034).
- **Una página por misterio**: pospuesta; la página de misterios ya lleva título, cita,
  fruto, intro y cláusula por ancla. Las páginas individuales tendrán sentido con las
  meditaciones citadas (032) y el arte (036).
- **Capturas reales en el inicio**: pendientes para cuando la identidad visual de la app
  esté cerrada (task 014).
- **Donativos**: la página existe; el método espera la decisión 3.
- Verificado: sin scripts ni assets de terceros (fuentes autoalojadas con fontsource); los
  únicos enlaces externos son citas (vatican.va y similares).

## Ciclo completo

- [x] Definir qué aplica
- [x] ~~Contenido y motor - n/a: los consume~~
- [x] ~~App - n/a~~
- [x] ~~Reloj - n/a~~
- [x] ~~Audio - n/a~~
- [ ] Accesibilidad - revisión formal con la task 012
- [ ] Sitio

## Primera pasada (agosto 2026)

Hecho, para verificar que el sitio y la app comparten contenido de verdad:

- Sitio en Astro con enrutado de idioma nativo (español sin prefijo, inglés en `/en/`).
- Página de inicio con el misterio del día, calculado por el mismo motor que la app.
- Página de los veinte misterios, con su pasaje, su fruto y su cláusula, leídos del
  paquete de contenido.
- Tema claro y oscuro con los mismos tokens que la app.

Falta todo lo demás de la spec: la guía de cómo se reza, las preguntas sobre indulgencias
y promesas, donar, privacidad, capturas, y las URL absolutas de las etiquetas de idioma
alternativo.

## Corregido tras la revisión doctrinal

- La cláusula del misterio se mostraba siempre en latín, también en las páginas en español
  e inglés.
- "Hoy toca" se calcula en tiempo de compilación: con el sitio estático, anuncia el
  misterio del día en que se compiló. Queda anotado en el componente; la solución
  (resolver la fecha en el navegador o marcar la ruta como servidor) entra al construir la
  task de verdad.
