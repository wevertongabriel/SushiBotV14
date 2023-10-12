import { DisTube } from "distube";
import { client } from "@/index";
import { EmbedBuilder } from "discord.js";
import fs from "fs";
import { coookies } from "@/settings/cookies";

class Distube extends DisTube {
  constructor() {
    super(client, {
      leaveOnStop: false,
      emitNewSongOnly: true,
      emitAddSongWhenCreatingQueue: false,
      emitAddListWhenCreatingQueue: false,
      searchSongs: 5,
      leaveOnEmpty: true,
      emptyCooldown: 0,
      youtubeCookie: coookies,
    });
    this.on("playSong", (queue, song) => {
      const embed = new EmbedBuilder()
        .setTitle("🚀 | NOVA MUSICA ADICIONADA")
        .setTimestamp()
        .setAuthor({
          name: client.user?.username as string,
          iconURL: client.user?.displayAvatarURL(),
        })
        .setThumbnail(song.thumbnail)
        .setColor("DarkGrey")
        .setFields(
          { name: "Requisitado por", value: `${song.user?.username}` },
          { name: "Musica", value: `${song.name}` },
          { name: "Url", value: `${song.url}` },
          { name: "Visualizações", value: `${song.views}` },
          { name: "Likes", value: `${song.likes}` },
          { name: "Duração", value: `${song.duration}` }
        );

      console.log(
        `NOVA MUSICA \n musica: ${song.name} ',\n duração: ${song.formattedDuration},\n discord: { id: ${queue.textChannel?.guildId}, name: ${queue.textChannel?.guild.name} },\n discord_channel: { id: ${queue.voiceChannel?.id}, name: ${queue.voiceChannel?.name} }`
      );

      queue.textChannel?.send({ embeds: [embed] });
    });

    this.on("addSong", (queue, song) =>
      queue.textChannel?.send(
        `Adicionada ${song.name} - \`${song.formattedDuration}\` para a fila por ${song.user}`
      )
    );
    this.on("addList", (queue, playlist) =>
      queue.textChannel?.send(
        `adicionada \`${playlist.name}\` lista de reprodução (${playlist.songs.length} músicas)`
      )
    );
    this.on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(
        `**Escolha uma opção abaixo**\n${result
          .map((song) => `**${++i}**. ${song.name} - \`${song.url}\``)
          .join(
            "\n"
          )}\n*Digite qualquer outra coisa ou aguarde 30 segundos para cancelar*`
      );
    });
    this.on("searchCancel", (message) =>
      message.channel.send("Pesquisa cancelada")
    );
    this.on("searchInvalidAnswer", (message) =>
      message.channel.send("Número de resultado inválido.")
    );
    this.on("searchNoResult", (message) =>
      message.channel.send("Nenhum resultado encontrado!")
    );
    this.on("error", (textChannel, e) => {
      console.error(e);
      textChannel?.send(`Um erro encontrado: ${e.message.slice(0, 2000)}`);
    });
    this.on("finish", (queue) => {
      queue.textChannel?.send("A fila acabou!");
    });
    this.on("disconnect", (queue) => queue.textChannel?.send("Disconnected!"));
    this.on("empty", (queue) =>
      queue.textChannel?.send(
        "O canal de voz está vazio! Saindo do canal de voz..."
      )
    );
    this.on("searchDone", () => {});
  }
}

export default new Distube();
