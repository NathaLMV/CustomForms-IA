# CustomForms-IA

Agente de Claude Code especializado en crear **formularios personalizados (server forms)**
para **Minecraft Bedrock** con el módulo `@minecraft/server-ui`, más un Behavior Pack
de ejemplo que reproduce menús reales tipo servidor (Hive Games, SkyWars, Murder Mystery).

Referencia oficial usada: https://wiki.bedrock.dev/scripting/server-forms

## ¿Qué incluye?

| Ruta                                          | Qué es |
| --------------------------------------------- | ------ |
| `.claude/agents/minecraft-form-builder.md`    | El **agente** experto en generar formularios de Bedrock. |
| `examples/hive-menu-bp/`                       | **Behavior Pack** de ejemplo, funcional, con los 3 menús de las imágenes. |

## Usar el agente

El agente `minecraft-form-builder` se activa automáticamente cuando pides crear
menús/UIs de Bedrock, o puedes invocarlo explícitamente. Ejemplos de peticiones:

- "Crea un menú de tienda con 4 categorías e iconos."
- "Hazme un formulario modal para configurar un kit (nombre, dificultad, vidas)."
- "Reproduce este menú de servidor a partir de esta captura."

El agente conoce los tres tipos de formulario y entrega código listo para `scripts/`:

- **`ActionFormData`** — menús con botones e iconos → respuesta en `selection`.
- **`MessageFormData`** — diálogo de 2 botones (sí/no) → respuesta en `selection` (0/1).
- **`ModalFormData`** — entrada de datos (texto, dropdown, slider, toggle) → `formValues`.

## Probar el Behavior Pack de ejemplo

El ejemplo (`examples/hive-menu-bp/`) reproduce las tres pantallas de referencia:

1. **Menú Hive Games** — selección de juego con iconos y nº de jugadores.
2. **Submenú SkyWars** — modos de juego (Solo, Dúos, Escuadrones, MEGA LTM).
3. **Murder Mystery Packs** — promoción con botón de acción.

Instalación:

1. Copia la carpeta `examples/hive-menu-bp/` dentro de
   `development_behavior_packs/` de tu instalación de Minecraft Bedrock
   (o empaquétala como `.mcpack`).
2. Crea/edita un mundo con **Beta APIs** y el comportamiento de scripting activado,
   y añade el pack.
3. Al entrar recibirás una **brújula**. Úsala (clic derecho/mantener pulsado) o
   escribe **`.menu`** en el chat para abrir el menú principal.

Disparadores definidos en `scripts/main.js`: uso de brújula y comando de chat `.menu`.
