import { db } from "@/database";
import { Command, Component } from "@/discord/base";
import Distube from "@/discord/base/Distube";
import { brBuilder, createModalInput, hexToRgb } from "@magicyan/discord";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionsBitField,
  GuildTextBasedChannel,
} from "discord.js";

new Command({
  name: "play",
  description: "Adicionar nova musica",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "musica",
      description: "Nome ou link da musica",
      type: ApplicationCommandOptionType.String,
      required,
    },
    {
      name: "volume",
      description: "Volume da musica atual",
      type: ApplicationCommandOptionType.Number,
      required: false,
    },
  ],
  async run(interaction) {
    const { member, options, guild } = interaction;

    //Definindo o tipo obrigatorio de channel;
    const channel = interaction.channel as GuildTextBasedChannel;

    //Extaindo comandos;
    const musicName = options.getString("musica", true);
    const musicVolume = options.getNumber("volume");

    //Indentificando canal de destino;
    const voiceChannel = member?.voice?.channel;

    //Verificando se o usuario esta em uma canal de voz;
    if (!voiceChannel)
      return interaction.reply({
        content: "Você precisa estar em um canal de voz para tocar música!",
        ephemeral: true,
      });

    //Verificando se o Client tem premissão para tocar no canal;
    const permissions = voiceChannel.permissionsFor(
      interaction.client.user
    ) as PermissionsBitField;

    if (!permissions.has("Connect") || !permissions.has("Speak")) {
      return interaction.reply({
        content:
          "Eu preciso de permissões para entrar e falar em seu canal de voz!",
        ephemeral: true,
      });
    }

    //Verificando se existe volume
    let volStatus = musicVolume ? musicVolume : false;

    //Reproduzindo musica;
    await Distube.play(voiceChannel, musicName, {
      member: member,
      textChannel: channel,
    });

    if (volStatus) {
      if (volStatus <= 0 || volStatus > 100) return;
      Distube.setVolume(guild, volStatus);
    }
  },
});
