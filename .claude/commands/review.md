Revisa los cambios actuales antes de mergear.

Argumento opcional: rango de commits (`/review HEAD~3`). Por defecto, los cambios contra
la rama base.

## 1. Identifica el cambio

- `git diff --name-only` sobre el rango
- Lee los archivos modificados
- Ubica la task de `docs/tasks/` que corresponde, si la hay

## 2. Lanza solo los agentes que aplican

No los lances todos por costumbre.

| Agente               | Cuándo                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| `@verificador`       | Siempre que exista una task con criterios de éxito                          |
| `@revisor-doctrinal` | Cambios en contenido litúrgico, copy, métricas, progresión o notificaciones |
| `@cto`               | Siempre                                                                     |
| `@disenador`         | Cambios en pantallas, tema, tipografía o accesibilidad                      |

En paralelo, en segundo plano.

**Al `@verificador` pásale únicamente la spec y el diff.** No le pases tu análisis ni lo
que ya revisaste: su valor está en no heredar tus puntos ciegos.

## 3. Corre las pruebas completas

Mientras los agentes trabajan, corre `pnpm check`. El dev que implementó corrió solo lo
suyo.

## 4. Resumen

- **Bloqueante**: no se mergea así
- **Importante**: se arregla antes de mergear
- **Sugerencia**: opcional
- **Pendiente de verificar en dispositivo**: lo que ningún agente pudo comprobar leyendo
  código
- **Veredicto**

Si un agente reporta que no logró romper algo, dilo tal cual. No lo traduzcas a "está
correcto".
