import { ActionFormData } from "@minecraft/server-ui";

/**
 * Custom form generado a partir del prompt:
 *   "título en medio-arriba, botones abajo, y el comentario arriba de los botones"
 *
 * Mapeo del layout a ActionFormData (el orden visual es fijo en este tipo de form):
 *   - .title()  -> título: siempre centrado en la parte superior.
 *   - .body()   -> "comentario": se dibuja debajo del título y ENCIMA de los botones.
 *   - .button() -> botones: se apilan en la parte inferior, en orden de declaración.
 */
export async function showExampleForm(player, system) {
  const form = new ActionFormData()
    .title("§l§eMI CUSTOM FORM") // título arriba (centrado)
    .body("§7Este es el comentario que aparece justo encima de los botones.") // comentario
    .button("§aOpción 1") // botones abajo
    .button("§bOpción 2")
    .button("§dOpción 3");

  const r = await form.show(player);
  if (r.canceled) {
    // r.cancelationReason puede ser "UserBusy" o "UserClosed".
    return;
  }

  const opciones = ["Opción 1", "Opción 2", "Opción 3"];
  player.sendMessage(`§eElegiste: §f${opciones[r.selection]}`);
}
