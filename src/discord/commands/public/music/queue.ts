import { Command } from "@/discord/base";
import { queueFunction } from "@/functions";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "lista",
  description: "Exibir lista de musicas em reprodução",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    queueFunction(interaction);
  },
});
