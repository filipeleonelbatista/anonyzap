"use client";
import React from "react";
import { UserProvider } from "@/context/UserContext";
import { ChatInterface } from "@/components/ChatInterface";

export default function RoomClient({ roomId, gifEnabled }: { roomId: string; gifEnabled?: boolean }) {
  return (
    <UserProvider>
      <ChatInterface roomId={roomId} gifEnabled={gifEnabled} />
    </UserProvider>
  );
}
