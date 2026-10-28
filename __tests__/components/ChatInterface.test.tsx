// Integration test: gifEnabled must reach ChatContent -> MessageInput through
// the exported wrapper (caught the wrapper dropping the prop in production).
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ChatInterface } from "@/components/ChatInterface";
import { LanguageProvider } from "@/context/LanguageContext";

jest.mock("@/context/UserContext", () => ({
  useUser: () => ({
    user: { id: "u1", name: "Alice", email: "a@a", avatar: "🐱", joinedAt: 1 },
    updateProfile: jest.fn(),
    register: jest.fn(),
    isRegistered: true,
    isAuthReady: true,
  }),
  UserProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/RoomContext", () => ({
  useRoom: () => ({
    messages: [],
    status: { type: "connected" as const },
    sendMessage: jest.fn(),
    reactToMessage: jest.fn(),
    deleteMessage: jest.fn(),
    loadOlderMessages: jest.fn(),
    hasMoreMessages: false,
    loadingOlder: false,
  }),
  RoomProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("ChatInterface gif gate forwarding", () => {
  // jsdom has no scrollIntoView (MessageList auto-scroll effect).
  beforeEach(() => {
    (Element.prototype as unknown as { scrollIntoView: () => void }).scrollIntoView = () => {};
  });

  test("renders the GIF button when gifEnabled passes the wrapper", () => {
    render(
      <LanguageProvider>
        <ChatInterface roomId="r1" gifEnabled />
      </LanguageProvider>
    );
    expect(screen.getByRole("button", { name: "GIF" })).toBeTruthy();
  });

  test("no GIF button when gifEnabled is absent", () => {
    render(
      <LanguageProvider>
        <ChatInterface roomId="r1" />
      </LanguageProvider>
    );
    expect(screen.queryByRole("button", { name: "GIF" })).toBeNull();
  });
});
