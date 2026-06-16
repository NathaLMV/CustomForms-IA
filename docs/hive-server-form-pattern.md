# Patrón de "switching server form" (estilo Hive)

Cómo servidores grandes (p. ej. Hive) muestran **varios layouts de formulario
totalmente personalizados** reusando el mismo formulario de servidor del juego,
sin que el script tenga que saber nada de JSON-UI más allá de **añadir un flag
invisible al título**.

> Este documento describe la *técnica*; no incluye archivos de terceros.
> Referencia general: https://wiki.bedrock.dev/json-ui/modifying-server-forms

## Idea central

1. El cliente siempre dibuja el mismo "server form" (un `ActionFormData`).
2. En el Resource Pack, `ui/server_form.json` **reemplaza** la pantalla del form
   por una propia con un `server_form_factory` cuyo `long_form` apunta a un
   **panel conmutador**.
3. El panel conmutador contiene:
   - el formulario **vanilla** (`@long_form`), visible solo cuando el título **no**
     contiene ningún flag;
   - **N paneles personalizados**, cada uno visible cuando el título contiene **su**
     flag.
4. El script elige el layout simplemente **concatenando el flag al título**.

## Los flags son glifos invisibles

Hive usa combinaciones de códigos de formato como marcadores:

```
$flag_grid:        "§m§a"
$flag_left_button: "§m§b"
$flag_bottom:      "§m§c"
...
```

`§m` (tachado) + `§a/§b/...` no aportan texto visible, así que el título se ve
normal pero lleva un "marcador" detectable.

## Detección por resta de cadenas

JSON-UI no tiene `contains`, pero sí **resta de strings**: `#title_text - $flag`.
Si el flag está dentro del título, la resta lo elimina y el resultado **cambia**;
si no está, el resultado es igual al original.

```jsonc
// visible cuando el flag SÍ está en el título
"source_property_name": "(not ((#title_text - $flag_grid) = #title_text))"

// visible cuando NINGÚN flag está (formulario vanilla de fallback)
"source_property_name": "(((#title_text - $flag_grid) = #title_text) and ((#title_text - $flag_left_button) = #title_text) and ...)"
```

## Estructura mínima de `server_form.json`

```jsonc
{
  "namespace": "server_form",

  // 1) Reemplaza la pantalla del server form
  "third_party_server_screen@common.base_screen": {
    "$screen_content": "server_form.main_screen_content",
    "button_mappings": [
      { "from_button_id": "button.menu_cancel", "to_button_id": "button.menu_exit", "mapping_type": "global" }
    ]
  },

  // 2) Factory: long_form -> panel conmutador
  "main_screen_content": {
    "type": "panel", "size": ["100%", "100%"],
    "controls": [
      { "server_form_factory": { "type": "factory",
        "control_ids": { "long_form": "@server_form.switching_long_form",
                          "custom_form": "@server_form.custom_form" } } }
    ]
  },

  // 3) Conmutador: vanilla + paneles por flag
  "switching_long_form": {
    "type": "panel", "size": ["100%", "100%"],
    "$flag_a": "§m§a", "$flag_b": "§m§b",
    "controls": [
      { "vanilla@long_form": { "bindings": [
        { "binding_type": "global", "binding_name": "#title_text", "binding_name_override": "#title_text" },
        { "binding_type": "view", "target_property_name": "#visible",
          "source_property_name": "(((#title_text - $flag_a) = #title_text) and ((#title_text - $flag_b) = #title_text))" }
      ] } },
      { "form_a@server_form.my_panel_a": { "bindings": [
        { "binding_type": "global", "binding_name": "#title_text", "binding_name_override": "#title_text" },
        { "binding_type": "view", "target_property_name": "#visible",
          "source_property_name": "(not ((#title_text - $flag_a) = #title_text))" }
      ] } }
    ]
  }
}
```

## Renderizar los botones del script (`form_buttons`)

Como el panel personalizado oculta el form vanilla, hay que **re-dibujar los
botones** que envía el script. Vienen en la colección `form_buttons`:

```jsonc
"my_buttons": {
  "type": "stack_panel", "orientation": "vertical", "size": [200, "100%c"],
  "factory": { "name": "button_list_factory", "control_name": "server_form.my_button" },
  "collection_name": "form_buttons",
  "bindings": [ { "binding_name": "#form_button_length", "binding_name_override": "#collection_length" } ]
},
"my_button@common.button": {
  "size": ["100%", 26], "$pressed_button_name": "button.form_button_click",
  "bindings": [ { "binding_type": "collection_details", "binding_collection_name": "form_buttons" } ],
  "controls": [
    { "default@server_form.my_button_face": { "$bg_tex": "textures/ui/button_borderless_light" } },
    { "hover@server_form.my_button_face":   { "$bg_tex": "textures/ui/button_borderless_lighthover" } },
    { "pressed@server_form.my_button_face": { "$bg_tex": "textures/ui/button_borderless_light" } }
  ]
},
"my_button_face": {
  "type": "image", "texture": "$bg_tex", "nineslice_size": [4,4,4,4], "size": ["100%","100%"],
  "controls": [ { "label": { "type": "label", "text": "#form_button_text", "text_alignment": "center",
    "anchor_from": "center", "anchor_to": "center",
    "bindings": [ { "binding_type": "collection", "binding_collection_name": "form_buttons",
      "binding_name": "#form_button_text", "binding_name_override": "#form_button_text" } ] } } ]
}
```

Datos útiles de cada botón de la colección:
- `#form_button_text` — texto del botón.
- `#form_button_texture` / `#form_button_texture_file_system` — icono (si `.button(text, icon)`).

El **cuerpo** del form está en `#form_text` (úsalo en un `label` para la descripción).

## Sub-flags dentro del texto del botón

Hive también mete flags en el **texto de cada botón** (`#form_button_text`) para
variar su estilo: p. ej. `§m§a` marca un botón "banner" y `§m§b` uno "especial"
(morado). Misma resta de cadenas, pero sobre `#form_button_text`.

## Cómo lo dispara el script

```js
import { ActionFormData } from "@minecraft/server-ui";
const FLAG_A = "§m§a"; // = "§m§a"

new ActionFormData()
  .title("JUGAR SKYWARS" + FLAG_A)   // el flag enruta al layout "form_a"
  .body("¡Elige tu modo!")           // -> #form_text
  .button("Solitario")               // -> form_buttons
  .button("Dúos")
  .show(player);
```

## Generador

`tools/jsonui-form-generator.html` produce un `server_form.json` con este patrón
(varios forms, flags automáticos, fallback vanilla, botones, fondo/imágenes/textos)
y además el `forms.js` con el flag correcto por form.
