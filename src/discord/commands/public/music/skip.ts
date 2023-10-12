import { Command } from "@/discord/base";
import { skipFunction } from "@/functions";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "skip",
  description: "Pular musica atual",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    skipFunction(interaction);
  },
});
