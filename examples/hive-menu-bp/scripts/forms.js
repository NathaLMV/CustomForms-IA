import { ActionFormData } from "@minecraft/server-ui";

/**
 * Reproduce las tres pantallas de las imágenes de referencia:
 *   1. Menú principal "Hive Games"   (selección de juego con iconos)
 *   2. Submenú "Jugar SkyWars"        (modos de juego + descripción)
 *   3. Diálogo "Murder Mystery Packs" (promoción con botón de acción)
 *
 * Todas son ActionFormData. La navegación se encadena leyendo r.selection
 * y mostrando el siguiente formulario.
 */

const RETRY_REASONS = ["UserBusy"];

/** Muestra un formulario; si el jugador estaba ocupado, reintenta una vez. */
async function safeShow(form, player, system) {
  let r = await form.show(player);
  while (r.canceled && RETRY_REASONS.includes(r.cancelationReason)) {
    await new Promise((res) => system.run(res));
    r = await form.show(player);
  }
  return r;
}

/** 1) Menú principal: ¿A dónde quieres ir? */
export async function showHiveMenu(player, system) {
  const form = new ActionFormData()
    .title("§l§eHIVE GAMES")
    .body(
      "§b¿A dónde quieres ir? Elige en nuestra selección de juegos o un viaje rápido a algún lugar.",
    )
    .button("§l§dBEDWARS\n§r§74876 jugadores", "textures/blocks/bed_feet_top")
    .button("§l§eSKYWARS\n§r§7894 jugadores", "textures/blocks/sponge")
    .button("§l§fMURDER MYSTERY\n§r§7839 jugadores", "textures/items/diamond_sword");

  const r = await safeShow(form, player, system);
  if (r.canceled) return;

  switch (r.selection) {
    case 0:
      player.sendMessage("§dEntrando a BedWars...");
      break;
    case 1:
      await showSkywarsMenu(player, system);
      break;
    case 2:
      await showMurderMysteryPacks(player, system);
      break;
  }
}

/** 2) Submenú SkyWars: modos de juego. */
export async function showSkywarsMenu(player, system) {
  const form = new ActionFormData()
    .title("§l§eJUGAR SKYWARS")
    .body(
      "§b¡Extrae minerales de la suerte para obtener botines y después pelea!\n\n§fEl equipo que sobreviva gana.",
    )
    .button("§aEn solitario (sin equipos)\n§r§7Haz clic para jugar")
    .button("§fDúos (equipos de 2 jugadores)\n§r§7Haz clic para jugar")
    .button("§dEscuadrones (equipos de 4 jugadores)\n§r§7Haz clic para jugar")
    .button("§6MEGA LTM (equipos de 7)\n§r§7Haz clic para jugar");

  const r = await safeShow(form, player, system);
  if (r.canceled) return;

  const modos = ["Solo", "Dúos", "Escuadrones", "MEGA LTM"];
  player.sendMessage(`§eUniéndote a SkyWars: §f${modos[r.selection]}`);
}

/** 3) Promoción Murder Mystery Packs (un único botón de acción). */
export async function showMurderMysteryPacks(player, system) {
  const form = new ActionFormData()
    .title("§l§fMURDER MYSTERY PACKS!")
    .body(
      "§bEleva tu experiencia de Murder Mystery con 5 packs nuevos. " +
        "¡Consíguelos por 660 Minecoins/pack hoy!",
    )
    .button("§l§aVER PACKS");

  const r = await safeShow(form, player, system);
  if (r.canceled) return;

  if (r.selection === 0) {
    player.sendMessage("§aAbriendo la tienda de packs de Murder Mystery...");
  }
}
