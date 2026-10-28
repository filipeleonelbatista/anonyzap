// Tests for the GIF button gate: shown only when gifEnabled is passed.
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageInput } from "@/components/MessageInput";
import { LanguageProvider } from "@/context/LanguageContext";

const baseProps = {
  onSend: jest.fn(async () => {}),
  onSendImage: jest.fn(),
  onSendGif: jest.fn(),
};

describe("MessageInput GIF button gate", () => {
  test("renders the GIF button next to the image button when gifEnabled", () => {
    render(
      <LanguageProvider>
        <MessageInput {...baseProps} gifEnabled />
      </LanguageProvider>
    );
    const buttons = screen.getAllByRole("button");
    const imageBtn = screen.getByRole("button", { name: /adicionar imagem|add image/i });
    const gifBtn = screen.getByRole("button", { name: "GIF" });
    // GIF button sits after the image button in the DOM
    expect(buttons.indexOf(gifBtn)).toBe(buttons.indexOf(imageBtn) + 1);
  });

  test("does not render the GIF button when gifEnabled is not set", () => {
    render(
      <LanguageProvider>
        <MessageInput {...baseProps} />
      </LanguageProvider>
    );
    expect(screen.queryByRole("button", { name: "GIF" })).toBeNull();
  });
});
