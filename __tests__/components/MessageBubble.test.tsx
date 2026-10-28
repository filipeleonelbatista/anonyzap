import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/components/MessageBubble";
import { LanguageProvider } from "@/context/LanguageContext";
import type { Message } from "@/types";

jest.mock("@/context/RoomContext", () => ({
  RoomProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
}));

const baseMessage: Message = {
  id: "1",
  roomId: "test",
  senderId: "user1",
  senderName: "Alice",
  senderAvatar: "😀",
  content: "Hello!",
  type: "text",
  status: "sent",
  timestamp: Date.now(),
  createdAt: new Date().toISOString(),
};

const noop = () => {};

function renderBubble(message: Message, isOwn = false) {
  return render(
    <LanguageProvider>
      <MessageBubble
        message={message}
        isOwn={isOwn}
        onReply={noop}
        scrollToMessage={noop}
      />
    </LanguageProvider>
  );
}

describe("MessageBubble", () => {
  it("renders text message content", () => {
    renderBubble(baseMessage);
    expect(screen.getByText("Hello!")).toBeTruthy();
  });

  it("shows sender name for other messages", () => {
    renderBubble(baseMessage);
    expect(screen.getByText("Alice")).toBeTruthy();
  });

  it("hides sender name for own messages", () => {
    renderBubble({ ...baseMessage, senderId: "me" }, true);
    expect(screen.queryByText("Alice")).toBeNull();
  });

  it("renders centered join system balloon", () => {
    const joinMsg: Message = {
      ...baseMessage,
      id: "sys-1",
      type: "system",
      presence: "join",
      content: "",
      senderName: "Bob",
    };
    renderBubble(joinMsg);
    expect(screen.getByRole("status").textContent).toContain(
      "Bob entrou na conversa"
    );
  });

  it("renders centered leave system balloon", () => {
    const leaveMsg: Message = {
      ...baseMessage,
      id: "sys-2",
      type: "system",
      presence: "leave",
      content: "",
      senderName: "Bob",
    };
    renderBubble(leaveMsg);
    expect(screen.getByRole("status").textContent).toContain(
      "Bob saiu da conversa"
    );
  });
});
