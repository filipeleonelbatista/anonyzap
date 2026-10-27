import type { Metadata } from "next";
import RoomClient from "./room-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anonyzap.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId: roomName } = await params;
  const roomUrl = `${BASE_URL}/${roomName}`;

  return {
    title: `Room #${roomName}`,
    description: `Join the conversation in room #${roomName} on AnonyZap. Real-time chat, no signup needed, no data stored. Share images and links instantly.`,
    openGraph: {
      title: `AnonyZap — Room #${roomName}`,
      description: `Join the conversation in room #${roomName}. Real-time chat, no signup needed, no data stored.`,
      url: roomUrl,
    },
    twitter: {
      title: `AnonyZap — Room #${roomName}`,
      description: `Join the conversation in room #${roomName}. Real-time chat, no signup needed.`,
    },
    alternates: {
      canonical: roomUrl,
    },
    robots: {
      index: false, // Don't index individual room pages
      follow: false,
    },
  };
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  return <RoomClient roomId={roomId} />;
}
