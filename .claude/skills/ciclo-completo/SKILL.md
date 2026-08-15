---
name: ciclo-completo
description:
  Cierra una feature de punta a punta - contenido y motor probados, app validada, reloj
  cuando aplica, audio, accesibilidad y sitio. Usar al terminar la implementación de una
  task, o para auditar qué le falta a una feature existente para estar terminada.
---

# Ciclo completo

Una feature no está terminada cuando funciona en el simulador: está terminada cuando cerró
su ciclo. Este skill recorre el ciclo y produce lo que falte. Los criterios de qué
superficie recibe qué están en `.agents/superficies.md`: leerlo antes de decidir, no
decidir de memoria.

Todo el ciclo corre bajo el estándar del skill `aim-high`: cargarlo junto con este. La
barra no es que funcione, es lo que entregaría un equipo que se juega su reputación.

Si la feature viene de una task de `docs/tasks/`, releer sus criterios de éxito antes de
empezar. Las tasks son specs de planeación, no ley: auditar el estado real contra el
código, preguntarse qué falta, qué sobra y qué ya no mapea, y ajustar el alcance. Las
desviaciones se documentan en la task (decisión y razón), nunca se aplican en silencio.

## 0. Estándares transversales

De `.agents/conventions.md`. El ciclo no cierra si alguno falta:

- **Ningún texto litúrgico sin fuente.** Si la feature añade o toca una oración, un
  misterio o una meditación, ese dato guarda de dónde salió. Sin fuente, no entra.
- **Nada que prometa efectos espirituales.** Ni en copy, ni en métricas, ni en
  notificaciones. Si la feature muestra un número, ese número es un acto contado, nunca
  una gracia.
- **La prueba de progresión.** Si la feature toca la Regla, el diario, las rosas, el
  Camino o el recogimiento, pasa las cinco preguntas de `docs/gamificacion.md` antes de
  darse por hecha.
- **Estados completos**: cargando, error, sin permiso, sin audio descargado, sin conexión,
  primera vez, sesión a medias.
- **Nada interrumpe el rezo**: ningún diálogo, permiso o aviso aparece durante una sesión
  en curso.
- **Copy en todos los idiomas activos**, en el mismo cambio, escrito con el skill `voz`.
- **Modo claro y oscuro**, y tipografía del sistema al máximo sin romperse.

## 1. Contenido y motor

Si la feature toca lo que se reza o cómo se ordena:

- El cambio vive en `packages/content` o `packages/engine`, no en la app.
- Tiene pruebas que cubren el comportamiento, no las líneas: cada forma regional afectada,
  cada idioma, y los casos límite del dominio (cambio de tiempo litúrgico, retomar a
  mitad, ajustes que se combinan).
- El validador de contenido sigue pasando.

## 2. App

- Criterios de éxito de la task cumplidos.
- Todos los estados de arriba, en claro y oscuro.
- Verificado en dispositivo real, no solo en el simulador, cuando la feature toca audio,
  háptica, permisos o rendimiento.

## 3. Reloj

Decidir con `.agents/superficies.md`. **El default es que sí** cuando la feature sirve
para rezar. Solo se queda fuera lo que es leer, configurar o elegir entre muchos.

Dejar algo fuera obliga a anotar en la task cuál de las tres razones aplica.

Al construir en el reloj: el rezo no puede depender de que el teléfono esté cerca o
encendido.

## 4. Audio

Si la feature añade texto que se reza, ese texto necesita su audio, sus cortes y sus
marcas de tiempo en los idiomas activos, o queda explícitamente pendiente en la task con
su razón.

## 5. Accesibilidad

- La pantalla se recorre entera con lector de pantalla y se entiende dónde se va.
- Con el tamaño de fuente del sistema al máximo, nada se recorta.
- Ninguna información depende solo del color.
- Lo que se puede hacer sin mirar, se puede hacer sin mirar.

## 6. Sitio

Si la feature cambia lo que el sitio promete o el contenido que muestra, el sitio se
actualiza en el mismo cambio, en todos sus idiomas. Los textos vienen del paquete de
contenido, nunca copiados.

## 7. Cierre

- Task actualizada si el alcance real difirió de lo escrito.
- `docs/FEATURES.md` ajustado si la feature cambió de forma.
- Resumen corto para el dev: qué se hizo en dos o tres líneas y **cómo verlo con sus
  propias manos**, con pasos concretos. Nada de "ya quedó" sin ruta para comprobarlo.
- Ese mismo "cómo probar" va en el cuerpo del PR.
- Reportar solo lo que alguien querría revertir: qué se decidió distinto de la norma, qué
  quedó fuera y por qué, qué va a doler después. Silencio significa hecho.
