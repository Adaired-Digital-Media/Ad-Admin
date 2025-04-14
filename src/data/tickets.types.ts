export interface UserRef {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TicketAttachment {
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface TicketMessage {
  _id: string;
  sender: UserRef;
  message: string;
  attachments: TicketAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TicketStatus {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
  REOPENED = "Reopened",
}

export enum TicketPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent",
}

export interface TicketMetadata {
  createdBy: "customer" | "support" | "admin";
  createdForCustomer: boolean;
  supportCreatedAsCustomer?: boolean;
}

export interface Ticket {
  _id?: string;
  ticketId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: UserRef;
  assignedTo: UserRef;
  customer: UserRef;
  messages: TicketMessage[];
  metadata: TicketMetadata;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  closedBy?: UserRef;
}

export const chatType = {
  Chat: "Chat",
  Email: "Email",
} as const;
