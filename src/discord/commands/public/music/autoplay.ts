import { Command } from "@/discord/base";
import { autoplayFunction } from "@/functions";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "autoplay",
  description: "Faz com o bot escolha a proxima musica",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    autoplayFunction(interaction);
  },
});
