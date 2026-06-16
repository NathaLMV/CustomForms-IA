import { ActionFormData } from "@minecraft/server-ui";

/**
 * EJEMPLO de salida del generador (tools/jsonui-form-generator.html).
 * Reemplaza este archivo por el forms.js que descargues, manteniendo el
 * nombre del export (open_<id>) o ajusta el import en main.js.
 *
 * Los flags "§m§a" son glifos invisibles que activan tu UI de JSON-UI
 * (server_form.json). Sin el Resource Pack, el form se ve como un form normal
 * de Bedrock; el script funciona igual.
 */

// Flags invisibles que activan cada UI (van en el TÍTULO).
const FLAG = {
  form1: "§m§a", // SkyWars -> SkyWarsForm.json
};

// Abrir "SkyWars"
export async function open_form1(player) {
  const form = new ActionFormData()
    .title("JUGAR SKYWARS" + FLAG.form1)
    .body("¡Elige tu modo de juego!")
    .button("Solitario")
    .button("Dúos")
    .button("Escuadrones");

  const r = await form.show(player);
  if (r.canceled) return;
  player.sendMessage("§eElegiste la opción #" + r.selection);
}
