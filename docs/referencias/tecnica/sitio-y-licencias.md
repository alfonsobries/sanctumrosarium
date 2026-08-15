# Sitio, donativos, licencias de contenido y accesibilidad

Verificado en agosto de 2026 contra npm, la documentación de Astro, WebKit, Stripe y las
fuentes de cada licencia.

## Astro

Versión actual **7.2.2**. Node mínimo 22.12. Lo que cambió y nos toca:

- **Astro 7 trae compilador en Rust por defecto**, más estricto: una etiqueta sin cerrar
  ahora es error en vez de arreglarse sola.
- **`compressHTML` pasó de `true` a `'jsx'`**: colapsa espacios entre elementos en línea.
  **Hay que probarlo con texto litúrgico**, donde los espacios entre etiquetas sí importan
  (versículos y respuestas).
- El pipeline de Markdown cambió de remark/rehype a otro motor; si hacen falta plugins de
  remark, se instala el paquete del pipeline anterior.

### Idiomas

El enrutado nativo (`i18n` en la configuración) hace el trabajo. Con seis idiomas conviene
`prefixDefaultLocale: true`, para no desbalancear las etiquetas de idioma alternativo. El
latín va como `la` a secas, sin variante regional.

**Astro no emite las etiquetas `hreflang` en el `<head>` por su cuenta**: solo
`@astrojs/sitemap` las pone en el XML. Hay que generarlas a mano en el layout, incluyendo
la autorreferencia y `x-default`.

### Contenido compartido con la app

**Las colecciones de contenido de Astro son una abstracción solo de Astro: React Native no
puede importarlas.** El patrón correcto es poner el contenido en un directorio compartido
y apuntar los cargadores de Astro ahí, dejando que la app lea los mismos archivos. **JSON
para datos estructurados** (que es portable), Markdown solo para guías largas que son
únicamente web.

En este proyecto eso ya está resuelto de otra forma, y mejor: el contenido vive en un
paquete de TypeScript que consumen las tres superficies.

### Despliegue

|                         | Vercel (gratis)    | Cloudflare (gratis)    | Netlify (gratis) |
| ----------------------- | ------------------ | ---------------------- | ---------------- |
| Formularios sin backend | No                 | No                     | **Sí**           |
| Límites                 | 100 GB/mes         | 100.000 peticiones/día | Créditos         |
| Imágenes                | Servicio integrado | Producto aparte        | No confirmado    |

**Recomendación: Netlify para lanzar** (sus formularios resuelven el contacto con HTML
puro y el sitio queda cien por cien estático), y **Vercel si algún día hacen falta
webhooks o lógica de servidor**, porque su adaptador es el mejor documentado.

## Rezar en el navegador: no

No es una limitación teórica, son **dos fallos abiertos de WebKit que describen
exactamente nuestro caso**:

- [#291892](https://bugs.webkit.org/show_bug.cgi?id=291892): el audio queda mudo cuando la
  app web vuelve de segundo plano. Abierto desde abril de 2025, **persiste en iOS 26**, y
  uno de los reportes dice que falla "el 100% de las veces".
- [#281566](https://bugs.webkit.org/show_bug.cgi?id=281566): `AudioContext.resume()` nunca
  resuelve si el navegador se suspende en segundo plano. Es decir: exactamente "pantalla
  bloqueada durante veinte minutos de Rosario".

Y la intuición de "lo hago aplicación instalable para que funcione mejor" **es al revés**:
el fallo está archivado precisamente contra ese caso.

**Lo que sí conviene hacer en la web:** un Rosario visual y de texto, con la pantalla
mantenida encendida (esa API sí es sólida desde iOS 18.4), audio corto solo en primer
plano, funcionamiento sin conexión, y una invitación honesta: "para rezar con los ojos
cerrados y la pantalla apagada, descarga la app". Una página de rezo útil e indexable
rinde más en buscadores que una landing, y es un embudo honesto en vez de una función que
se rompe en silencio a mitad del Ave María.

## Donativos en la web

Comisiones de Stripe en México: **3.6% + 3 pesos** en tarjeta nacional, +0.5%
internacional, +2% por conversión de divisa, +0.7% para suscripciones, **y el IVA se suma
encima de todas las comisiones**.

Los enlaces de pago **sí permiten que el donante elija el importe**, pero **importe libre
y suscripción no pueden convivir en el mismo enlace**: hacen falta dos.

| Plataforma      | Comisión propia                          | ¿México? | ¿Exige ser ONG?              |
| --------------- | ---------------------------------------- | -------- | ---------------------------- |
| **Stripe**      | 0 (solo proceso)                         | Sí       | No                           |
| Ko-fi (gratis)  | 0% en propinas puntuales, 5% en lo demás | Sí       | No                           |
| Buy Me a Coffee | 5% fijo                                  | Sí       | No                           |
| GitHub Sponsors | 0%                                       | Sí       | **Exige ser código abierto** |
| PayPal          | ~7-8% efectivo                           | Sí       | No                           |
| Liberapay       | 0%                                       | Sí       | Solo recurrente              |

**Recomendación: dos enlaces de pago de Stripe** (uno puntual con importe libre, otro de
apoyo mensual), sin backend ni webhooks. Ko-fi como secundario, recordando salir del
estado que cobra 5%.

**Nota fiscal, informativa y no asesoría:** en México los donativos de no parientes están
exentos hasta cierto múltiplo anual, y hay obligación de informarlos en la declaración
anual por encima de 600.000 pesos. Lo que distingue un donativo de un pago es la
**gratuidad**: si desbloquea algo, es venta. Llamarlo "propina" o "apoyo" es más honesto y
más seguro. **Consultar a un contador antes de montar el flujo.**

## Licencias de contenido

### Textos bíblicos

| Texto                                        | Estatus         | Dónde                                                                                                                                                                                   |
| -------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vulgata Clementina**                       | Dominio público | [modern-douay-rheims](https://github.com/curran-gehring/modern-douay-rheims): 35.809 versículos en TSV, canon completo, repositorio CC0. **La mejor fuente de toda esta investigación** |
| **Douay-Rheims (Challoner)**                 | Dominio público | El mismo repositorio, alineado 1:1                                                                                                                                                      |
| **World English Bible con deuterocanónicos** | Dominio público | ebible.org. La mejor opción libre en inglés moderno                                                                                                                                     |
| **Torres Amat**, **Scío**                    | Dominio público | archive.org, pero son **escaneos con OCR sucio**, no texto limpio                                                                                                                       |
| Nova Vulgata                                 | © Vaticano      | Riesgo real embeberla. Usar la Clementina                                                                                                                                               |
| Biblia de Jerusalén, CEE, NABRE, RSV-CE      | Con derechos    | Ninguna publica tarifa para apps                                                                                                                                                        |

**La conclusión sin adornos: no existe ninguna traducción católica moderna al español con
licencia abierta.** Las opciones reales son Torres Amat o Scío (siglo XIX, lenguaje
anticuado, fuente sucia) o licenciar. Es la decisión 10 y hay que cerrarla antes de
escribir el contenido bíblico.

### Oraciones y magisterio

- Los textos de vatican.va llevan copyright de la Librería Editora Vaticana. **Citas
  cortas con referencia son estándar; reproducir bloques grandes requiere permiso.**
- **ICEL** licencia sus traducciones oficiales al inglés y **cobra regalías por
  publicaciones comerciales, apps incluidas**. Confirmado en su propia página de
  copyright.
- **Lo seguro**: en latín, todo es de dominio público. En inglés y español, **la redacción
  tradicional** de las oraciones (la que se reza desde hace siglos) precede a cualquier
  copyright moderno. Lo que hay que evitar es copiar la redacción distintiva de un misal
  moderno concreto.
- Los **títulos** de los misterios luminosos son etiquetas cortas y no están protegidos;
  **los párrafos de reflexión de Juan Pablo II sí**.

### Meditaciones de dominio público

- **San Alfonso María de Ligorio, Las Glorias de María**: inglés de 1852 y español de 1868
  en archive.org, claramente libres. **Evitar las ediciones de 1931**, que aún tienen
  derechos.
- **Newman, Meditations and Devotions** (1893): libre.
- **Montfort, El secreto admirable**: el original francés es libre, pero **la traducción
  inglesa común es de 1954 y sigue con derechos**. Hay que buscar una traducción anterior
  o escribir la propia sobre el francés.
- **Faber** (murió en 1863): libre, y muy infrautilizado. Buen material mariano para dar
  variedad.
- Regla de corte para 2026 en Estados Unidos: **publicado en 1930 o antes es dominio
  público.**

### Arte sacro

Filtrar el proceso a **solo CC0 y reproducciones de obras en dominio público**, y guardar
la licencia junto a cada archivo desde el primer día.

- **Wikimedia Commons** es la columna vertebral más segura (reproducciones fieles de
  pinturas en dominio público).
- **Art Institute of Chicago**: sin clave de API, verificado. **National Gallery of Art**:
  CC0 en descarga directa. **Met**: metadatos CC0, pero hay que revisar el marcador de
  dominio público por obra. **Cleveland**: CC0 solo donde el registro lo dice.
- **Museos Vaticanos: no.** Prohíben expresamente reproducir y distribuir sus fotografías,
  aunque la obra sea del siglo XVI. Para la Capilla Sixtina, usar una foto de terceros en
  Commons.
- **Web Gallery of Art y Google Arts & Culture**: solo para identificar qué obra se
  quiere, no para descargarla.
- **Evitar CC BY-SA**: si se recorta o se le pone un filtro, el derivado hereda la
  licencia.

### Canto gregoriano

**La melodía es de dominio público; la grabación es un derecho separado.** Un canto del
siglo IX es libre como composición, pero una grabación moderna tiene sus propios derechos.

- **GregoBase** no documenta la licencia de sus datos: hay que escribir a los
  mantenedores.
- **Solesmes** reclama derechos sobre sus ediciones y signos rítmicos del siglo XX.
- **archive.org es peligroso**: muchas subidas de canto son grabaciones comerciales
  infractoras. Si el objeto no declara licencia, no se usa.
- **neumz.com es un servicio de suscripción**, no una fuente licenciable.

**Lo correcto para una app de larga vida: encargar grabaciones originales con cesión
total.** Una schola local o un cantor pueden grabar los tonos que hagan falta por un costo
único razonable.

## Accesibilidad

Es lo más importante de esta sección para nuestro público: mucha gente que reza el Rosario
a diario tiene más de setenta años.

- **Tamaño de objetivo táctil**: el mínimo de WCAG 2.2 es 24 px, pero **hay que apuntar al
  de 44 px**. Las cuentas y el botón de avanzar son el gesto más repetido de la app.
- **Contraste**: el mínimo es 4.5:1, pero **para el texto de las oraciones hay que apuntar
  a 7:1**. La sensibilidad al contraste cae con la edad y se reza en penumbra.
- **Nunca blanco puro sobre negro puro**: produce halación y molesta especialmente a ojos
  mayores. Gris cálido claro sobre negro.
- **Nunca `allowFontScaling={false}`** en el texto de las oraciones. Si hace falta un
  techo, un multiplicador generoso, no desactivarlo.
- **Todo lo que se haga arrastrando necesita alternativa de un solo toque** (criterio
  2.5.7, nivel AA).
- **No anunciar el progreso cada segundo** con el lector de pantalla: solo las
  transiciones que importan (cambio de misterio, fin de decena), con lenguaje humano
  ("tercer misterio, sexta cuenta") en vez de números crudos.
- **Los cuatro ciclos de misterios no pueden distinguirse solo por color**: forma, icono y
  etiqueta.
- **La háptica por cuenta es probablemente la mejor función de accesibilidad que se puede
  construir aquí**: permite rezar con la pantalla apagada y el teléfono en el bolsillo.
