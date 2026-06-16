import { world, system, ItemStack } from "@minecraft/server";
import { showHiveMenu } from "./forms.js";

/**
 * Punto de entrada del Behavior Pack de ejemplo.
 *
 * Disparadores para abrir el menú principal:
 *   - Usar (clic derecho) una brújula  -> abre el menú Hive Games.
 *   - Escribir ".menu" en el chat        -> abre el menú Hive Games.
 */

// Disparador 1: usar una brújula
world.afterEvents.itemUse.subscribe((event) => {
  const { source: player, itemStack } = event;
  if (itemStack?.typeId !== "minecraft:compass") return;
  // show() debe ejecutarse fuera del read-only del handler de evento.
  system.run(() => showHiveMenu(player, system));
});

// Disparador 2: comando de chat ".menu"
world.beforeEvents.chatSend.subscribe((event) => {
  if (event.message.trim().toLowerCase() !== ".menu") return;
  event.cancel = true;
  const player = event.sender;
  system.run(() => showHiveMenu(player, system));
});

// Da una brújula al entrar para probar el menú rápidamente.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  const inv = player.getComponent("minecraft:inventory")?.container;
  inv?.addItem(new ItemStack("minecraft:compass", 1));
  player.sendMessage("§aUsa la §lbrújula§r§a o escribe §l.menu§r§a para abrir el menú.");
});
