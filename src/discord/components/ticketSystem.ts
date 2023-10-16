import { db } from "@/database";
import {
  getCollection,
  getTicket,
} from "@/database/functions/ticketCollection";
import { Component } from "@/discord/base";
import { createNewTicket } from "@/functions";
import { createRow } from "@magicyan/discord";
import {
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import { ref } from "typesaurus";

new Component({
  customId: "systems-ticket-button",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    if (!interaction.isButton()) return;

    await interaction.deferReply({ ephemeral });

    const { guild, member } = interaction;

    //Buscando guildDocument no banco de dados
    const data = await db.get(db.guilds, guild.id);

    //Criando um id aleatorio
    const ticketId = Math.floor(Math.random() * 9000) + 10000;

    //Buscando a collection de tickets;
    const dataTicket = await getTicket(member, member.id);

    if (dataTicket) {
      const channelTicketSearch = guild.channels.cache.get(
        dataTicket.ticket.ChannelID
      );
      const embedTicketExist = new EmbedBuilder({
        title: "Você ja tem um ticket em aberto!",
        description: "Verifique as informações abaixo",
        fields: [
          {
            name: "ID",
            value: `${dataTicket.ticket.TicketID}`,
          },
          {
            name: "Canal",
            value: `${channelTicketSearch}`,
          },
        ],
      });
      return interaction.editReply({
        embeds: [embedTicketExist],
      });
    }

    //Buscando a collection de tickets;
    const dataCollection = await getCollection(member, member.id);

    //Se dataa ou tickets não exister pare o codigo;
    if (!data)
      return interaction.editReply({
        content: "O sistema te tickets não esta configurado!",
      });
    //Caso o ticket global ainda não esteja configurado;
    if (!data.global?.ticketSetup) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Sistema de Ticket")
            .setColor("Red")
            .setDescription("Você ainda não configurou o sistema de tickets.")
            .addFields({
              name: "<:Slash:1088996088712794162> Usar",
              value: "<:icon_reply:1088996218283229184>  /tickets setup",
              inline: true,
            }),
        ],
        ephemeral: true,
      });
    }

    //Verificando se o bot tem permissão para criar canais;
    if (!guild?.members.me?.permissions.has(PermissionFlagsBits.ManageChannels))
      return interaction
        .editReply({
          content: "Desculpe, não tenho permissões.",
        })
        .catch((error) => {
          return console.error(error);
        });

    //Criando canal
    try {
      const channelTicket = await guild.channels.create({
        name: `🎫・ticket┋${interaction.user.tag}┋` + ticketId,
        type: ChannelType.GuildText,
        topic: interaction.user.id,
        parent: data.global.ticketSetup.Category,
        permissionOverwrites: [
          {
            id: data.global.ticketSetup.Everyone,
            deny: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
          },
          {
            id: data.global.ticketSetup.Handlers,
            allow: [
              "ViewChannel",
              "SendMessages",
              "ReadMessageHistory",
              "ManageChannels",
            ],
          },
          {
            id: member?.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
          },
        ],
      });

      if (!channelTicket) {
        return interaction.editReply({
          content: "Ocorreu um erro ao crir o canal! ",
        });
      }

      //Criando o ticket e retornando o ticket;
      const createTicket = await createNewTicket(
        interaction,
        channelTicket,
        ticketId
      );

      //Caso o usuario ja tenha um ticket em aberto;
      if (createTicket == false)
        return interaction
          .editReply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Desculpe, mas você já tem um ticket aberto")
                .setColor("Red"),
            ],
          })
          .catch((error) => {
            return console.error(error);
          });
      //Caso a função retorne undefined
      else if (createTicket == undefined)
        return interaction.editReply({
          content: "erro ao criar o ticker, consulte um administrador!",
        });

      await channelTicket
        .setTopic("🌿 Ticket aberto por" + " <@" + member?.id + ">")
        .catch((error: any) => {
          return console.log(error);
        });
      const embed = new EmbedBuilder()
        .setTitle("Bem-vindo a você, obrigado por abrir um ticket.")
        .setDescription(
          "Um membro de nossa equipe de moderação em breve cuidará de sua solicitação.\nObrigado por esperar com calma e bom humor"
        );

      let buttons = createRow(
        new ButtonBuilder({
          customId: "ticket-close",
          label: "Fechar",
          emoji: "📪",
          style: ButtonStyle.Danger,
        })
      );

      channelTicket
        .send({ embeds: [embed], components: [buttons] })
        .catch((error: any) => {
          return console.error(error);
        });

      const handlersmention = await channelTicket.send({
        content: "<@&" + data.global.ticketSetup.Handlers + ">",
      });
      handlersmention.delete().catch((error: any) => {
        return console.error(error);
      });
      const ticketmessage = new EmbedBuilder()
        .setDescription(
          "✅ O seu ticket foi criado" + " <#" + channelTicket.id + ">"
        )
        .setColor("Green");
      interaction.editReply({ embeds: [ticketmessage] }).catch((error) => {
        return console.error(error);
      });
    } catch (error) {
      interaction.editReply({ content: "Ocorreu um erro! " });
      return console.error(error);
    }
  },
});
