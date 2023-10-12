import Distube from "@/discord/base/Distube";
import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";

export function stopFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction.guild);
  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });
  Distube.stop(interaction);
  Distube.voices.get(interaction)?.leave();

  return interaction.reply({
    content: "Musica parada com sucesso! ",
    ephemeral: true,
  });
}

export function pauseFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction.guild);
  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });
  Distube.pause(interaction);

  return interaction.reply({
    content: "Musica pausada com sucesso! ",
    ephemeral: true,
  });
}

export function volumeFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const { options, guild } = interaction;

  const queue = Distube.getQueue(interaction.guild);
  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });

  //Extaindo valor;
  const volumeMusic = options.getNumber("valor", true);
  if (volumeMusic <= 0 || volumeMusic > 100)
    return interaction.reply({
      content: "So são permitidos numeros de 0 a 100 para o volume da musica",
      ephemeral: true,
    });

  Distube.setVolume(guild, volumeMusic);

  return interaction.reply({
    content: `Volume modificado com sucesso para ${volumeMusic}%`,
    ephemeral: true,
  });
}

export function autoplayFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction.guild);
  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });
  const autoplay = queue.toggleAutoplay();
  return interaction.reply(`AutoPlay: \`${autoplay ? "On" : "Off"}\``);
}

export function loopFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction.guild);
  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });

  const mode = Distube.setRepeatMode(interaction);
  return interaction.reply({
    content: `Definido o modo de repetição para \`${
      mode ? (mode === 2 ? "Todas as filas" : "Esta canção") : "Off"
    }\``,
  });
}

export function queueFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction.guild);

  if (!queue)
    return interaction.reply({
      content: `Não estou tocando em nenhum canal!`,
      ephemeral: true,
    });

  const song = queue.songs;
  return interaction.reply({
    content: `Current queue:\n ${song
      .map(
        (
          song: any,
          id: any //(${song.url})
        ) => `**${id + 1}**. [${song.name}] - \`${song.formattedDuration}\``
      )
      .join("\n")}`,
    ephemeral: true,
  });
}

export async function skipFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const queue = Distube.getQueue(interaction);
  if (!queue)
    return interaction.reply({
      content: `Não há nada na fila agora!`,
      ephemeral: true,
    });
  try {
    const song = await queue.skip();
    interaction.reply({
      content: `Musica pulada com sucesso. proxima musica:\n **${song.name}**`,
      ephemeral: true,
    });
  } catch (e) {
    interaction.reply({
      content: `${e}`,
      ephemeral: true,
    });
  }
}

export async function filterFunction(
  interaction: ChatInputCommandInteraction<"cached">
) {
  const { options } = interaction;

  const queue = Distube.getQueue(interaction);
  if (!queue)
    return interaction.reply({
      ephemeral: true,
      content: `Não há nada na fila agora!`,
    });

  const filter = options.getString("tipo", true);
  if (filter === "off" && queue.filters.size) queue.filters.clear();
  else if (Object.keys(Distube.filters).includes(filter)) {
    if (queue.filters.has(filter)) queue.filters.remove(filter);
    else queue.filters.add(filter);
  } else if (filter)
    return interaction.reply({
      ephemeral: true,
      content: `Não é um filtro válido`,
    });
  interaction.reply({
    content: `Filtro da fila atual: \`${
      queue.filters.names.join(", ") || "Off"
    }\``,
    ephemeral: true,
  });
}
