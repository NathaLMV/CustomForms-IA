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
| `tools/jsonui-form-generator.html`             | **Generador visual** (offline) que exporta el `.json` de JSON-UI de un custom form. |
| `examples/generated/SkyWarsForm.json`          | Salida de ejemplo del generador (fondo + banner + texto). |

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

`tools/jsonui-form-generator.html` es una página **autónoma (offline)** para diseñar
un custom form y **descargar su `.json` de JSON-UI** ya listo. Ábrela con doble clic
en cualquier navegador.

Qué hace:

- Defines un **marcador de título** (el texto que tu script pone en `.title()`); el
  form personalizado solo se activa cuando el título lo contiene.
- **Añades / quitas** elementos: imágenes, **fondo** (imagen 100%) y textos (labels),
  cada uno con textura, tamaño, `anchor`, `offset` y `layer`.
- Usa la técnica de **factory + binding por título** de la wiki, con nombres únicos
  por form (`cf_<id>_…`), así puedes tener **varios custom forms a la vez sin tocar
  el `server_form.json` original** — cada form es su propio archivo.
- Opción "Ocultar el formulario original" para reemplazo total en vez de overlay.

Uso del archivo generado:

1. Pon el `.json` descargado (p. ej. `SkyWarsForm.json`) en `resource_pack/ui/`.
2. Regístralo en `ui/_ui_defs.json`: `{ "ui_defs": [ "ui/SkyWarsForm.json" ] }`.
3. Coloca las texturas referenciadas en su ruta (`textures/ui/...`).

En `examples/generated/SkyWarsForm.json` tienes una salida de ejemplo
(fondo + banner + texto) para ver el formato resultante.
