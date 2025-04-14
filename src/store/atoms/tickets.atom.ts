/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { atom } from "jotai";
import { atomWithCache } from 'jotai-cache'
import { Ticket } from "@/data/tickets.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI || "";

type TicketsState = {
  tickets: Ticket[];
  searchQuery: string;
  selectedTicketId: string | null;
};

export interface AdminStats {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  ticketsAssignedToMe: number;
}

export interface SupportStats {
  totalAssignedToMe: number;
  pendingTickets: number;
  deliveredTickets: number;
  myEfficiency: number;
}

export interface StatsResponse {
  success: boolean;
  stats: AdminStats | SupportStats;
}

export const ticketsAtom = atom<TicketsState>({
  tickets: [],
  searchQuery: "",
  selectedTicketId: null,
});

export const selectedTicketAtom = atomWithCache((get) => {
  const { tickets, selectedTicketId } = get(ticketsAtom);
  return tickets.find((ticket) => ticket.ticketId === selectedTicketId) || null;
});

export const filteredTicketsAtom = atom((get) => {
  const { tickets, searchQuery } = get(ticketsAtom);
  if (!searchQuery.trim()) return tickets;

  const query = searchQuery.toLowerCase();
  return tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(query) ||
      ticket.description?.toLowerCase().includes(query) ||
      ticket._id?.toLowerCase().includes(query)
  );
});

export const ticketsWithActionsAtom = atom(
  (get) => get(ticketsAtom),
  async (
    get,
    set,
    action:
    | { type: "set"; payload: Ticket[] }
    | { type: "fetch"; accessToken: string; queryParams?: Record<string, any> }
    | { type: "search"; query: string }
    | { type: "create"; data: any; accessToken: string }
    | { type: "update"; id: string; data: any; accessToken: string }
    | { type: "delete"; id: string; accessToken: string }
    | { type: "selectTicket"; ticketId: string | null }
    | { type: "fetchStats"; accessToken: string }
  ) => {
    const fetchTickets = async (
      accessToken: string,
      params?: Record<string, any>
    ) => {
      const queryString = params ? new URLSearchParams(params).toString() : "";

      const response = await fetch(
        `${API_BASE_URL}/tickets/read?${queryString}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch tickets");
      const { data } = await response.json();
      return data as Ticket[];
    };

    const currentState = get(ticketsAtom);

    const fetchStats = async (accessToken: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/tickets/stats`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch stats");
        const { data } = await response.json();
        return data as StatsResponse;
      } catch (error) {
        console.error("Fetch stats failed:", error);
      }
    };

    switch (action.type) {
      case "set":
        set(ticketsAtom, { ...currentState, tickets: action.payload });
        break;

      case "fetch":
        try {
          const tickets = await fetchTickets(
            action.accessToken,
            action.queryParams
          );
          set(ticketsAtom, { ...currentState, tickets });
        } catch (error) {
          console.error("Fetch tickets failed:", error);
        }
        break;

      case "search":
        set(ticketsAtom, { ...currentState, searchQuery: action.query });
        break;

      case "selectTicket":
        set(ticketsAtom, {
          ...currentState,
          selectedTicketId: action.ticketId,
        });
        break;

      case "create":
        try {
          const response = await axios.post(
            `${API_BASE_URL}/ticket/create`,
            action.data,
            {
              headers: {
                Authorization: `Bearer ${action.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status !== 201)
            throw new Error("Failed to create ticket");
          const newTicket = response.data;
          set(ticketsAtom, {
            ...currentState,
            tickets: [...currentState.tickets, newTicket],
            selectedTicketId: newTicket._id,
          });
          await fetch("/api/revalidateTags?tags=tickets", { method: "GET" });
        } catch (error) {
          console.error("Create ticket failed:", error);
          throw error;
        }
        break;

      case "update":
        try {
          const response = await axios.patch(
            `${API_BASE_URL}/tickets/update?id=${action.id}`,
            action.data,
            { headers: { Authorization: `Bearer ${action.accessToken}` } }
          );
          if (response.status !== 200)
            throw new Error("Failed to update ticket");
          const updatedTicket = response.data;
          set(ticketsAtom, {
            tickets: currentState.tickets.map((ticket) =>
              ticket._id === action.id ? updatedTicket : ticket
            ),
            searchQuery: currentState.searchQuery,
            selectedTicketId: currentState.selectedTicketId,
          });
          await fetch("/api/revalidateTags?tags=tickets", { method: "GET" });
        } catch (error) {
          console.error("Update ticket failed:", error);
          throw error;
        }
        break;

      case "delete":
        try {
          await axios.delete(`${API_BASE_URL}/ticket/delete?id=${action.id}`, {
            headers: { Authorization: `Bearer ${action.accessToken}` },
          });
          set(ticketsAtom, {
            tickets: currentState.tickets.filter(
              (ticket) => ticket._id !== action.id
            ),
            searchQuery: currentState.searchQuery,
            selectedTicketId:
              currentState.selectedTicketId === action.id
                ? null
                : currentState.selectedTicketId,
          });
          await fetch("/api/revalidateTags?tags=tickets", { method: "GET" });
        } catch (error) {
          console.error("Delete ticket failed:", error);
          throw error;
        }
        break;

      case "fetchStats":
        try {
          const stats = await fetchStats(action.accessToken);
          if (stats?.success) {
            // Handle stats update if needed
          }
        } catch (error) {
          console.error("Fetch stats failed:", error);
        }
        break;
    }
  }
);
