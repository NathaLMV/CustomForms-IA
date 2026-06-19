import { world, system, ItemStack } from "@minecraft/server";
import { open_form1 } from "./forms.js";

/**
 * Entrada del Behavior Pack de prueba.
 * Formas de abrir el form:
 *   - Usar (clic derecho / mantener) una BRÚJULA.
 *   - Escribir ".menu" en el chat.
 * Al entrar al mundo se te da una brújula automáticamente.
 */

// Abrir con la brújula
world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack?.typeId !== "minecraft:compass") return;
  system.run(() => open_form1(ev.source));
});

// Abrir con el comando de chat ".menu"
world.beforeEvents.chatSend.subscribe((ev) => {
  if (ev.message.trim().toLowerCase() !== ".menu") return;
  ev.cancel = true;
  const player = ev.sender;
  system.run(() => open_form1(player));
});

// Dar una brújula al entrar
world.afterEvents.playerSpawn.subscribe((ev) => {
  if (!ev.initialSpawn) return;
  const inv = ev.player.getComponent("minecraft:inventory")?.container;
  inv?.addItem(new ItemStack("minecraft:compass", 1));
  ev.player.sendMessage("§aUsa la §lbrújula§r§a o escribe §l.menu§r§a para abrir el form.");
});
