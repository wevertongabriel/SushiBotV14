import { Command } from "@/discord/base";
import { stopFunction } from "@/functions";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "stop",
  description: "Parar lista atual",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    stopFunction(interaction);
  },
});
