import { GuildMember, Interaction, TextChannel, User } from "discord.js";
import { GuildDocument, UserDocument, db } from "..";
import { getCollection, getTicket } from "./ticketCollection";
import { TicketsDocument } from "../documents/TicketDocument";

export async function hasRegister(id: string) {
  const data = await db.get(db.users, id);
  return !!data;
}
export async function createRegister({ username, id }: User) {
  await db.set(db.users, id, { username });
  return (await db.get(db.users, id)) as UserDocument;
}
export async function getRegister(user: User) {
  const data = await db.get(db.users, user.id);
  if (data) return data;
  return createRegister(user);
}
export async function deleteRegister(user: User) {
  const data = await db.get(db.users, user.id);
  if (!data) return;
  return await db.delete(db.users, user.id);
}
export async function hasRegisterTicket(userId: string, guildId: string) {
  const data = await db.get(db.guilds, guildId);
  if (!data || !data.ticketSystem) return false;
  const ticketData = await db.get(data.ticketSystem, userId);
  return !!ticketData;
}
export async function registerNewTicket(
  interaction: Interaction,
  channelTicket: TextChannel,
  ticketId: number
) {
  const { guild, user, channel } = interaction;
  if (!channel || !guild) return;

  const member = interaction.member as GuildMember;

  const collectionTickets = await getCollection(member, user.id);

  await db.upset(collectionTickets, interaction.user.id, {
    ticket: {
      _id: guild.id,
      MemberID: interaction.user.id,
      ChannelID: channelTicket.id,
      OwnerID: interaction.user.id,
      TicketID: ticketId,
    },
  });
  return (await db.get(
    collectionTickets,
    interaction.user.id
  )) as TicketsDocument;
}
