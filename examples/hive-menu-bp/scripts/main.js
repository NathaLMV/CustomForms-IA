import { world, system, ItemStack } from "@minecraft/server";
import { showHiveMenu } from "./forms.js";
import { showExampleForm } from "./example_custom_form.js";

/**
 * Punto de entrada del Behavior Pack de ejemplo.
 *
 * Disparadores:
 *   - Usar (clic derecho) una brújula  -> abre el menú Hive Games.
 *   - Escribir ".menu" en el chat        -> abre el menú Hive Games.
 *   - Escribir ".form" en el chat        -> abre el custom form de ejemplo.
 */

// Disparador 1: usar una brújula
world.afterEvents.itemUse.subscribe((event) => {
  const { source: player, itemStack } = event;
  if (itemStack?.typeId !== "minecraft:compass") return;
  // show() debe ejecutarse fuera del read-only del handler de evento.
  system.run(() => showHiveMenu(player, system));
});

// Disparador 2: comandos de chat ".menu" y ".form"
world.beforeEvents.chatSend.subscribe((event) => {
  const cmd = event.message.trim().toLowerCase();
  const player = event.sender;
  if (cmd === ".menu") {
    event.cancel = true;
    system.run(() => showHiveMenu(player, system));
  } else if (cmd === ".form") {
    event.cancel = true;
    system.run(() => showExampleForm(player, system));
  }
});

// Da una brújula al entrar para probar el menú rápidamente.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  const inv = player.getComponent("minecraft:inventory")?.container;
  inv?.addItem(new ItemStack("minecraft:compass", 1));
  player.sendMessage("§aUsa la §lbrújula§r§a o escribe §l.menu§r§a para abrir el menú.");
});
