import * as typesaurs from "typesaurus";
import { TicketsDocument } from "./TicketDocument";

interface GuildLogs {
  channel?: string;
}

interface ticketSetupInterface {
  _id: string;
  Channel: string;
  Category: string;
  Handlers: string;
  Everyone: string;
  Description: string | null;
  TicketMessageId: string;
  Button?: [string];
}

interface GuildGlobal {
  channel?: string;
  role?: string;
  messages?: {
    join?: string;
    leave?: string;
  };
  colors?: {
    join?: string;
    leave?: string;
  };
  ticketSetup?: ticketSetupInterface;
}

export interface GuildDocument {
  logs?: GuildLogs;
  global?: GuildGlobal;
  ticketSystem?: typesaurs.Collection<TicketsDocument>;
}
