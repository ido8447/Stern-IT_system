export class Ticket {
  TicketId: string;
  Email: string;
  Status: string;
  Subject: string;
  Priority: string;
  Description: string;
  Created: string;
  ToManagerName:string;
  CustomerName:string;
}

export class TicketInfo {
  TicketId: string;
  Email: string;
  Status: string;
  Subject: string;
  Priority: string;
  Description: string;
}

export class TicketStatusInfo {
  Id: string;
  Status: string;
  Priority: string;
}


export class TicketModel {
  Status: string;
  Email: string;
}
