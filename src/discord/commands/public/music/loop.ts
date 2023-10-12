import { Command } from "@/discord/base";
import { loopFunction } from "@/functions";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "loop",
  description: "Colocar faixa atual em loop",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  run(interaction) {
    loopFunction(interaction);
  },
});
