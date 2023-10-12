import { Command } from "@/discord/base";
import { filterFunction } from "@/functions";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

new Command({
  name: "filter",
  description: "Coloque aqui um dos tipos de filtro",
  type: ApplicationCommandType.ChatInput,
  dmPermission,
  options: [
    {
      name: "tipo",
      description: "3d, bassboost, echo, karaoke, nightcore, vaporwave",
      type: ApplicationCommandOptionType.String,
      choices: [
        { name: "3d", value: "filter3D" },
        { name: "bassboost", value: "filterBassboost" },
        { name: "echo", value: "filterEcho" },
        { name: "karaoke", value: "filterKaraoke" },
        { name: "nightcore", value: "filterNightcore" },
        { name: "vaporwave", value: "filterVaporwave" },
      ],
      required,
    },
  ],
  run(interaction) {
    filterFunction(interaction);
  },
});
