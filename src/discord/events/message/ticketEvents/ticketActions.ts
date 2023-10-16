import { db } from "@/database";
import {
  getCollection,
  getTicket,
} from "@/database/functions/ticketCollection";
import { Event } from "@/discord/base";
import { guildLog, registerNewMember } from "@/functions";
import { settings } from "@/settings";
import { brBuilder, createRow } from "@magicyan/discord";
import {
  ActionRowBuilder,
  EmbedBuilder,
  GuildChannel,
  PermissionFlagsBits,
  TextBasedChannel,
  UserSelectMenuBuilder,
  bold,
} from "discord.js";
import { field } from "typesaurus";

new Event({
  name: "interactionCreate",
  async run(interaction) {
    if (!interaction.inCachedGuild()) return;

    const { member, guild, client } = interaction;

    const { ManageChannels, SendMessages } = PermissionFlagsBits;
    const channel = interaction.channel as GuildChannel & TextBasedChannel;

    if (!interaction.isButton()) return;
    if (
      ![
        "ticket-close",
        "ticket-lock",
        "ticket-unlock",
        "ticket-manage",
        "ticket-claim",
      ].includes(interaction.customId)
    )
      return;

    const docs = await db.get(db.guilds, guild.id);
    if (!docs || !docs.global?.ticketSetup?.Handlers) return;
    const errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Algo deu errado, tente novamente mais tarde");

    const executeEmbed = new EmbedBuilder().setColor("Aqua");
    const nopermissionsEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription("Desculpe, mas você não tem permissão para fazer isso");
    const alreadyEmbed = new EmbedBuilder().setColor("Orange");
    const data = await getTicket(member, member.id);
    const collectionTicket = await getCollection(member, member.id);

    if (!data)
      return interaction
        .reply({ embeds: [errorEmbed], ephemeral: true })
        .catch((error) => {
          return console.error(error);
        });
    if (
      !interaction.member.roles.cache.has(docs.global?.ticketSetup?.Handlers) &&
      interaction.member.id != data.ticket.MemberID
    )
      return interaction
        .reply({ embeds: [nopermissionsEmbed], ephemeral: true })
        .catch((error) => {
          return console.log(error);
        });
    interaction.guild.members.cache.get(data.ticket.MemberID);
    interaction.guild.members.cache.get(data.ticket.OwnerID);

    switch (interaction.customId) {
      case "ticket-close":
        if (
          !interaction.member.permissions.has(ManageChannels) &&
          !interaction.member.roles.cache.has(
            docs.global.ticketSetup.Handlers
          ) &&
          interaction.member.id != data.ticket.MemberID
        )
          return interaction
            .reply({ embeds: [nopermissionsEmbed], ephemeral: true })
            .catch((error) => {
              return console.error(error);
            });

        const closingTicket = new EmbedBuilder()
          .setTitle("O ticket está sendo fechado no momento...")
          .setDescription("ticket será fechado em 5 segundos.")
          .setColor("Red");

        interaction.deferUpdate().catch((error) => {
          return;
        });
        interaction.channel
          ?.send({ embeds: [closingTicket] })
          .catch((error) => {
            return console.error(error);
          });

        await db.remove(collectionTicket, member.id);

        guildLog({
          guild,
          executor: client.user,
          author: {
            name: "Sistema de registro",
            iconURL: interaction.user.displayAvatarURL(),
          },
          message: brBuilder(
            "Novo ticket criado!",
            `> ${member} ${bold(`@${interaction.user.username}`)}`,
            `> TICKET ID: ${bold(`${data.ticket.TicketID}`)}`
          ),
          color: settings.colors.theme.info,
        });

        setTimeout(() => {
          interaction.channel?.delete().catch((error) => {
            return console.error(error);
          });
        }, 5000);
        break;
    }
  },
});
