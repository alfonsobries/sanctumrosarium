# El Rosario

App móvil y sitio web para rezar el Santo Rosario: español, inglés y latín, con audio,
Apple Watch y una progresión pensada para la constancia, no para el enganche. Fiel a lo
que la Iglesia católica enseña.

> El nombre del producto todavía no está decidido. Ver
> [`docs/DECISIONES.md`](docs/DECISIONES.md).

## Estructura

```
app/                # App móvil (Expo, React Native) y el target del reloj
site/               # Sitio (Astro)
packages/content/   # Lo que se reza: oraciones, misterios, formas regionales, con su fuente
packages/engine/    # El motor del Rosario: la secuencia de pasos, como lógica pura
docs/               # Plan, roadmap, tasks, voz y las referencias doctrinales y técnicas
competencia/        # Análisis del mercado
.agents/            # Contexto para agentes (empezar por .agents/index.md)
```

## Empezar

```bash
pnpm install
pnpm app     # servidor de desarrollo de la app
pnpm site    # servidor de desarrollo del sitio
pnpm check   # lint, tipos y pruebas
```

## Por dónde entrar

- Qué se construye y por qué: [`docs/PLAN.md`](docs/PLAN.md)
- Qué falta decidir: [`docs/DECISIONES.md`](docs/DECISIONES.md)
- En qué orden: [`docs/ROADMAP.md`](docs/ROADMAP.md)
- Qué dice la Iglesia sobre el Rosario, que es la fuente de todo el contenido:
  [`docs/referencias/rosario-doctrina.md`](docs/referencias/rosario-doctrina.md)
