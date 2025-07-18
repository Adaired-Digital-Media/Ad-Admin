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
  readBy?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  REOPENED = "reopened",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface TicketMetadata {
  createdBy: "customer" | "support" | "admin";
  createdForCustomer: boolean;
  supportCreatedAsCustomer?: boolean;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: UserRef;
  assignedTo: string | UserRef;
  customer: UserRef;
  participants?: string[];
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

export interface TicketStatsResponse {
  role: "admin" | "support" | "customer";
  stats: {
    total: number;
    open: number;
    closed: number;
    resolved?: number;
    assignedToMe?: number;
    efficiency?: number;
    reopened?: number;
  };
}

export interface SupportStats {
  totalAssignedToMe: number;
  pendingTickets: number;
  deliveredTickets: number;
  myEfficiency: number;
}
