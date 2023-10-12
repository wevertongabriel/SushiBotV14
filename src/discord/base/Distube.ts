import { DisTube } from "distube";
import { client } from "@/index";
import { EmbedBuilder } from "discord.js";
import fs from "fs";
import cookies from "@settings/cookies.json";

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
      youtubeCookie: [
        {
          name: "__Secure-1PAPISID",
          value: "6QGFO4LqkfMNsGi8/AWv3KduGeO_dN-Rsz",
          expirationDate: 1731634701.158706,
          domain: ".youtube.com",
          path: "/",
          secure: true,
          httpOnly: false,
          hostOnly: false,
          sameSite: "unspecified",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158457,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-1PSID",
          path: "/",
          sameSite: "unspecified",
          secure: true,
          value:
            "bwglhmUpQS9YZvhh69CcfEZzfkJV3oLmSAqCMGa3Q_FINtFp8YMVoi8ZWZRy725uFSpaIQ.",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1728674526.438329,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-1PSIDCC",
          path: "/",
          sameSite: "unspecified",
          secure: true,

          value:
            "ACA-OxNOlULPqowwNvqzAVW-Jj7yYxYf6llPC-MygrLpaMolC3MH9DgIjfCWadoi4B64LQxvCQw",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1728674431.485081,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-1PSIDTS",
          path: "/",
          sameSite: "unspecified",
          secure: true,
          value:
            "sidts-CjIB3e41hZYMBYAVpSfaM5f5rldVT6IPYbQFv-qu_w6aHfrB_0PrYQCJr2TkmN3Jq5Z7_xAA",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158736,
          hostOnly: false,
          httpOnly: false,
          name: "__Secure-3PAPISID",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value: "6QGFO4LqkfMNsGi8/AWv3KduGeO_dN-Rsz",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158485,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-3PSID",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value:
            "bwglhmUpQS9YZvhh69CcfEZzfkJV3oLmSAqCMGa3Q_FINtFpBIsaLn0iWcuj3ql-mHg54Q.",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1728674526.438366,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-3PSIDCC",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value:
            "ACA-OxPb3tJmgjwddG4A0fgynVBsu_Mdd0D_mkPzkowtLtM8YXhngl9m5PLmuAKXYsQGwjDwhkA",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1728674431.485174,
          hostOnly: false,
          httpOnly: true,
          name: "__Secure-3PSIDTS",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value:
            "sidts-CjIB3e41hZYMBYAVpSfaM5f5rldVT6IPYbQFv-qu_w6aHfrB_0PrYQCJr2TkmN3Jq5Z7_xAA",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158588,
          hostOnly: false,
          httpOnly: false,
          name: "APISID",
          path: "/",
          sameSite: "unspecified",
          secure: false,
          value: "qrH4r2BRGDcuQuWQ/A-gVONc2dCVYhjQe9",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158521,
          hostOnly: false,
          httpOnly: true,
          name: "HSID",
          path: "/",
          sameSite: "unspecified",
          secure: false,
          value: "ABBCqbpSNLevDWdAE",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731674551.101744,
          hostOnly: false,
          httpOnly: true,
          name: "LOGIN_INFO",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value:
            "AFmmF2swRgIhALM5fab-FZFK0BB_GJFmpAwJaoFZgpvgbOE00to2U-G-AiEAqbgG9QUZ0KCAAeMklzZbyuPWLeU9nlo6ExgEtAg475Y:QUQ3MjNmeXlXc001WnI4YWR4TG9NT3I2UVR4WWtVVXZKMG5nWE5OU0I4ajBCRFV1b3gzZjZCcGM1Qzl2V1lGN1dGX1hfc1o1dXlRa0hUZVNvV2dFUVd2bFdJMXk2UHdPMlYzRHM2SWlvZ3EwMnVEd0I5REVzNm5wTHhPZVhXdjRoZ01tVENKb1Qtc1EwT2x6c2J5eFV4QWpBTmZDWnZyZFlB",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731694817.690276,
          hostOnly: false,
          httpOnly: false,
          name: "PREF",
          path: "/",
          sameSite: "unspecified",
          secure: true,
          value: "f6=40000000&tz=America.Sao_Paulo&f7=100",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.15864,
          hostOnly: false,
          httpOnly: false,
          name: "SAPISID",
          path: "/",
          sameSite: "unspecified",
          secure: true,
          value: "6QGFO4LqkfMNsGi8/AWv3KduGeO_dN-Rsz",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158255,
          hostOnly: false,
          httpOnly: false,
          name: "SID",
          path: "/",
          sameSite: "unspecified",
          secure: false,
          value:
            "bwglhmUpQS9YZvhh69CcfEZzfkJV3oLmSAqCMGa3Q_FINtFp40cRBUipWHY0OVWsmmCipw.",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1728674526.438204,
          hostOnly: false,
          httpOnly: false,
          name: "SIDCC",
          path: "/",
          sameSite: "unspecified",
          secure: false,
          value:
            "ACA-OxNl2g5ADGM8ZOH4ILFHPQmhEot-VgRuAcNFvDB_Vrabkz9Jkbli4YsljRt92WXc43SqXg",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1731634701.158549,
          hostOnly: false,
          httpOnly: true,
          name: "SSID",
          path: "/",
          sameSite: "unspecified",
          secure: true,
          value: "AahlnsrD8G2nvVIXx",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1712666551.101796,
          hostOnly: false,
          httpOnly: true,
          name: "VISITOR_INFO1_LIVE",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value: "tW6XwIJvVN0",
        },
        {
          domain: ".youtube.com",
          expirationDate: 1712666838.407263,
          hostOnly: false,
          httpOnly: true,
          name: "VISITOR_PRIVACY_METADATA",
          path: "/",
          sameSite: "lax",
          secure: true,
          value: "CgJCUhICGgA%3D",
        },
        {
          domain: ".youtube.com",
          hostOnly: false,
          httpOnly: true,
          name: "YSC",
          path: "/",
          sameSite: "no_restriction",
          secure: true,
          value: "i0Dveqij2MY",
        },
      ],
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