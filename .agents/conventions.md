# Convenciones

Reglas que aplican en la mayoría de las tareas.

## Contenido litúrgico

- **Ningún texto de oración, misterio o meditación se escribe de memoria ni se genera.**
  Sale de `docs/referencias/rosario-doctrina.md` o de una fuente citable, y guarda esa
  fuente en el dato.
- **Se distingue siempre** magisterio, liturgia y tradición piadosa. Las quince promesas
  se muestran con su origen y sin lenguaje de garantía.
- **Las indulgencias se describen, no se otorgan.** La app nunca marca una indulgencia
  como conseguida ni promete efectos sobrenaturales.
- **Lo esencial del Rosario no es configurable**: misterio, Padrenuestro, diez Avemarías y
  Gloria. Lo demás es marco regional.

## Progresión

- Se cuentan actos (rosarios, decenas, días, minutos), nunca gracias.
- Sin tablas de posiciones, sin comparar con otras personas, sin rachas que se pierdan con
  drama, sin notificaciones de pérdida.
- Todo lo lúdico se puede apagar y la app sigue completa.
- Antes de dar por buena una pantalla de progresión, se pasa la prueba de
  `docs/gamificacion.md`.

## Privacidad

- Lo que alguien reza **no sale de su dispositivo**. Sin analítica de comportamiento, sin
  cuentas, sin servidor por defecto.
- Los permisos (micrófono, salud, notificaciones) se piden en el momento en que se usan y
  con una explicación de para qué.

## Código

- Package manager: **pnpm** en todo el monorepo.
- `packages/content` y `packages/engine` son lógica pura: sin React, sin Expo, sin Astro,
  con pruebas completas. La app y el sitio los consumen.
- Tipos estrictos, sin `any`. Los identificadores de oraciones y misterios son estables:
  no se renombran.
- Código, comentarios, nombres de test y commits en inglés; documentación en español.
- Fechas y horas: el diario guarda la fecha local de quien reza, no UTC. Un Rosario de las
  11 de la noche es de ese día.

## Interfaz

- Modo oscuro primero: se reza de noche.
- Tipografía que crece hasta el máximo del sistema sin romperse.
- Ninguna pantalla del rezo se interrumpe con diálogos, permisos o avisos.
- Estados completos: cargando, error, sin permiso, sin audio descargado, sin conexión,
  primera vez, sesión a medias.
- Nunca un contador sin su misterio a la vista.

## Texto de cara al usuario

Antes de escribir copy, `docs/voz.md` y el skill `voz`. Todo el copy existe en todos los
idiomas activos en el mismo cambio.

## Protegidos

Nunca leer ni commitear `.env*`, credenciales, claves de firma ni certificados.
