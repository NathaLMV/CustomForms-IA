# CustomForms-IA

Agente de Claude Code especializado en crear **formularios personalizados (server forms)**
para **Minecraft Bedrock** con el módulo `@minecraft/server-ui`, más un Behavior Pack
de ejemplo que reproduce menús reales tipo servidor (Hive Games, SkyWars, Murder Mystery).

Referencia oficial usada: https://wiki.bedrock.dev/scripting/server-forms

## ¿Qué incluye?

| Ruta                                          | Qué es |
| --------------------------------------------- | ------ |
| `.claude/agents/minecraft-form-builder.md`    | El **agente** experto en generar formularios de Bedrock (incluye JSON-UI). |
| `examples/hive-menu-bp/`                       | **Behavior Pack** de ejemplo, funcional, con los 3 menús de las imágenes. |
| `examples/hive-menu-rp/`                       | **Resource Pack** (JSON-UI) que añade un **banner de imagen** al form de Murder Mystery. |
| `tools/jsonui-form-generator.html`             | **Generador visual** (offline) que exporta un `server_form.json` estilo Hive (varios forms). |
| `docs/hive-server-form-pattern.md`             | Guía del patrón "switching server form" (flags invisibles, factory, `form_buttons`). |
| `examples/generated/`                          | Salidas de ejemplo del generador (`server_form.json`, `SkyWarsForm.json`). |

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

## Banner de imagen con JSON-UI (Resource Pack)

Los server forms de scripting **no** admiten imágenes de banner en el cuerpo. Para
lograrlas (como el cuadro promocional de la imagen de Murder Mystery) se usa
**JSON-UI** en un Resource Pack. El ejemplo `examples/hive-menu-rp/`:

- Registra una segunda *factory* `server_form_factory` que dibuja solo un banner
  como overlay, **sin duplicar** el formulario.
- El banner aparece únicamente cuando el título del form contiene
  `MURDER MYSTERY PACKS` (coincidencia por subcadena sobre `#title_text`).
- La textura está en `textures/ui/customforms/murder_mystery_banner.png`
  (placeholder; **reemplázala por tu arte** manteniendo el nombre).

Instalación:

1. Copia `examples/hive-menu-rp/` a `development_resource_packs/`.
2. Activa **ambos** packs en el mundo (el Behavior Pack y este Resource Pack).
3. Abre el menú → SkyWars/Murder Mystery → "VER PACKS" y verás el banner.

> JSON-UI es sensible a la versión del juego: `size` y `offset` del banner en
> `ui/server_form.json` suelen necesitar ajuste fino dentro del cliente.
> Referencia: https://wiki.bedrock.dev/json-ui/modifying-server-forms

## Generador visual de custom forms (HTML)

`tools/jsonui-form-generator.html` es una página **100% autónoma (offline, sin
dependencias)**: ábrela con doble clic en cualquier navegador. Diseña **varios
forms** con vista previa en vivo y **exporta un `server_form.json` completo** que usa
el patrón real de servidores tipo Hive (ver `docs/hive-server-form-pattern.md`).

Qué genera:

- Un `server_form.json` con un `server_form_factory` → **panel conmutador** que
  enruta cada form por un **flag de glifo invisible** (`§m§a`, `§m§b`, …) en el título.
- El **formulario vanilla como fallback** (cuando el título no lleva ningún flag).
- Los **botones reales** del script (colección `form_buttons`) re-dibujados, más la
  **descripción** (`#form_text`) y tus **imágenes / fondo / textos** posicionados por
  `anchor`/`offset`/`layer`.
- Además, un `forms.js` con la función para abrir cada form (ya concatena su flag).
- Solo depende de namespaces **vanilla** (`common`), así que funciona sin packs de terceros.

Por elemento puedes cargar una **imagen local solo para previsualizar** (no se
exporta). Añades/quitas forms y elementos en vivo.

Uso del archivo generado:

1. Pon el `server_form.json` descargado en `resource_pack/ui/server_form.json`
   (sobrescribe el vanilla; **no** necesita `_ui_defs.json`).
2. Coloca las texturas que referencies en su ruta (`textures/ui/...`).
3. En tu Behavior Pack, abre cada form con `.title("..." + FLAG.<id>)` (ver el `forms.js`).

En `examples/generated/` tienes salidas de ejemplo (`server_form.json` con dos forms,
y `SkyWarsForm.json`).

> JSON-UI es sensible a la versión del juego y no se puede testear fuera del cliente:
> los `offset`/`size` del layout pueden necesitar ajuste fino dentro de Minecraft.
