import { Command } from "@/discord/base";
import { loopFunction } from "@/functions";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

new Command({
  name: "playlist",
  description: "Colocar uma playlist como lista de musicas",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "link",
      description: "link da playlist",
      type: ApplicationCommandOptionType.String,
      required,
    },
  ],
  run(interaction) {
    return interaction.reply({ content: "Funcionara em breve! ", ephemeral });
  },
});
