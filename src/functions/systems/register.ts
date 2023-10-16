import {
  createRegister,
  db,
  hasRegister,
  deleteRegister,
  hasRegisterTicket,
  registerNewTicket,
  GuildDocument,
} from "@/database";
import {
  GuildMember,
  Interaction,
  PartialGuildMember,
  TextChannel,
  bold,
} from "discord.js";
import { guildLog } from "./logs";
import { brBuilder } from "@magicyan/discord";
import { settings } from "@/settings";
import { getTicket } from "@/database/functions/ticketCollection";

export async function registerNewMember(member: GuildMember) {
  const { client, guild, user } = member;

  if (user.bot) return;

  db.get(db.guilds, guild.id).then((data) => {
    const roleId = data?.global?.role || "";
    if (!guild.roles.cache.has(roleId) || member.roles.cache.has(roleId))
      return;
    member.roles.add(roleId);
  });

  if (await hasRegister(user.id)) return;
  await createRegister(user);

  guildLog({
    guild,
    executor: client.user,
    author: { name: "Sistema de registro", iconURL: user.displayAvatarURL() },
    message: brBuilder(
      "Novo membro registrado",
      `> ${member} ${bold(`@${user.username}`)}`,
      `> ID: ${bold(user.id)}`
    ),
    color: settings.colors.theme.success,
  });
}

export async function deleteMember(member: GuildMember | PartialGuildMember) {
  const { user, guild, client } = member;

  if (await hasRegister(user.id)) {
    await deleteRegister(user);
  }

  guildLog({
    guild,
    executor: client.user,
    author: { name: "Sistema de registro", iconURL: user.displayAvatarURL() },
    message: brBuilder(
      "Membro deletado dos registros",
      `> ${member} ${bold(`@${user.username}`)}`,
      `> ID: ${bold(user.id)}`
    ),
    color: settings.colors.theme.info,
  });

  return;
}

export async function createNewTicket(
  interaction: Interaction,
  channelTicket: TextChannel,
  ticketId: number
) {
  const { client, guild, user } = interaction;
  if (!guild) return;
  if (user.bot) return;

  const member = interaction.member as GuildMember;

  if (await hasRegisterTicket(user.id, guild.id)) return false;
  const createAndTicket = await registerNewTicket(
    interaction,
    channelTicket,
    ticketId
  );

  if (!createAndTicket) return;

  guildLog({
    guild,
    executor: client.user,
    author: { name: "Sistema de registro", iconURL: user.displayAvatarURL() },
    message: brBuilder(
      "Novo ticket criado!",
      `> ${member} ${bold(`@${user.username}`)}`,
      `> TICKET ID: ${bold(`${createAndTicket.ticket.TicketID}`)}`
    ),
    color: settings.colors.theme.info,
  });

  return createAndTicket;
}
