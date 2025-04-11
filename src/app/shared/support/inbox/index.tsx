"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Session } from "next-auth";
import MessageDetails from "./message-details";
import { ticketsWithActionsAtom } from "@/store/atoms/tickets.atom";

export default function SupportInbox({
  initialTicketId,
  session,
}: {
  initialTicketId?: string;
  session: Session;
}) {
  const setTickets = useSetAtom(ticketsWithActionsAtom);

  useEffect(() => {
    if (session?.user?.accessToken) {
      // Select initial ticket if provided
      if (initialTicketId) {
        setTickets({
          type: "selectTicket",
          ticketId: initialTicketId,
        });
      }
    }
  }, [session?.user?.accessToken, initialTicketId, setTickets]);

  return (
    <div className="@container">
      <div className="mt-2 items-start @container @4xl:grid @4xl:grid-cols-12 @4xl:gap-7 @[1550px]:grid-cols-11">
        <MessageDetails session={session} className="hidden @4xl:col-span-full @4xl:block @[1550px]:col-span-full" />
      </div>
    </div>
  );
}
