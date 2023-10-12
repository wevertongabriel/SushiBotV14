import { Command } from "@/discord/base";
import { volumeFunction } from "@/functions";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

new Command({
  name: "volume",
  description: "Editar volume da musica atual!",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor do volume da musica",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  run(interaction) {
    volumeFunction(interaction);
  },
});
