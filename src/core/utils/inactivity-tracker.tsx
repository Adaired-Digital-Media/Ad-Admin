"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 60 minutes

export default function InactivityTracker() {
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        signOut({ callbackUrl: '/auth/signIn' });
      }, INACTIVITY_TIMEOUT);
    };

    // Initial setup
    resetTimer();

    // Events that reset the timer
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  return null;
}