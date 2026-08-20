# Task 046 - Cofradía del Rosario

## Objetivo

La regla semanal de quince decenas y un enlace a la inscripción, con las palabras de la
propia Cofradía.

## Dependencias

- Task 025

## Contexto

Más de quinientos años. Obligación: quince misterios por semana, "this does not bind under
sin". Sin cuotas ni reuniones. Los luminosos se animan como un Rosario extra; la Cofradía
no ha recibido declaración oficial que los sustituya.

La decisión 11 recomienda integrarla. La inscripción real la hacen los dominicos
(rosarycenter.org o un convento). La app no inscribe a nadie.

## Qué construir

### 1. La Regla

Es la de "quince decenas por semana" que ya tiene la 025, con el nombre de la Cofradía y
su frase.

### 2. Inscripción

Enlace a rosarycenter.org (o al convento local que se documente). Texto: qué es, que no
obliga bajo pecado, que no se inscribe a difuntos, que un no católico puede ser admitido.
Nada de formulario nuestro.

### 3. Contador semanal

Quince (o veinte, si el usuario incluye luminosos) decenas en la semana. Huecos sin drama.

## Criterios de éxito

1. El texto dice que no obliga bajo pecado, con esa idea, en la misma pantalla.
2. La app no afirma que el usuario "ya es cofrade".
3. Fallar unos días no expulsa ni castiga.
4. La pantalla pasa las cinco preguntas de `docs/gamificacion.md`.

## Decisiones tomadas (primera pasada, agosto 2026)

- **Pantalla propia "La Cofradía del Rosario"**, enlazada desde la Regla cuando se elige
  "Al modo de la Cofradía": qué es, que su compromiso no obliga bajo pecado (en la misma
  pantalla, criterio 1), los luminosos como Rosario extra sin declaración oficial, los
  beneficios descritos con sus palabras y con las condiciones habituales, y las reglas de
  inscripción (personal, sin difuntos, no católicos admisibles).
- **La app no inscribe a nadie ni llama cofrade a nadie**: botón "Inscribirse con los
  dominicos" que abre rosarycenter.org, con nota de dominicos.org y dominicos.mx.
- El contador semanal es el de la Regla de quince decenas que ya existía (025); fallar
  días no expulsa (la fidelidad ya trata los huecos sin drama, 026).
- **Pendiente**: el avance de la semana en el reloj (bloque del reloj) y documentar un
  convento local si el dev quiere otro destino de inscripción.

## Ciclo completo

- [x] Definir qué aplica
- [x] Contenido y motor - n/a: el texto es de la pantalla, citado a rosarycenter.org
- [x] App
- [ ] Reloj - el avance de la semana, no la inscripción (bloque del reloj)
- [x] ~~Audio - n/a~~
- [x] Accesibilidad - texto plano y un enlace externo con etiqueta clara
- [x] ~~Sitio - n/a en esta pasada~~

## Fuentes

- Dossier C.6 (Cofradía); rosarycenter.org; León XIII, Augustissimae Virginis Mariae
