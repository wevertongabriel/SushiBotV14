import { GuildMember } from "discord.js";
import { GuildDocument, db } from "..";
import { TicketsDocument } from "../documents/TicketDocument";

export async function getCollection(member: GuildMember, id: string) {
  const path = `guilds/${member.guild.id}/ticketSystem/`;
  let i = db.collection<TicketsDocument>(path);
  if (!i) return i;
  return i;
}

export async function getTicket(member: GuildMember, id: string) {
  const path = `guilds/${member.guild.id}/ticketSystem/`;
  return await db.get(db.collection<TicketsDocument>(path), id);
}
