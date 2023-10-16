interface TicketInterface {
  _id: string;
  OwnerID: string;
  MemberID: string;
  TicketID: number;
  ChannelID: string;
}

export interface TicketsDocument {
  ticket: TicketInterface;
}
