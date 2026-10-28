// Tests for the GIF picker popover: search field, trending preload, pick → onPick.
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { GifPicker } from "@/components/GifPicker";
import type { GifResult } from "@/types";

const gif: GifResult = { id: "abc", title: "Wow", smallUrl: "https://media.giphy.com/s.gif", url: "https://media.giphy.com/big.gif" };
const cats: GifResult = { id: "def", title: "Cats", smallUrl: "https://media.giphy.com/cats.s.gif", url: "https://media.giphy.com/cats.gif" };
let onPick: jest.Mock;

// fake timers control the 300ms debounce; RTL's waitFor advances them.
describe("GifPicker", () => {
  beforeEach(() => {
    onPick = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ gifs: [gif] }) });
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const open = () => {
    render(<LanguageProvider><GifPicker onPick={onPick} /></LanguageProvider>);
    fireEvent.click(screen.getByRole("button", { name: /gif/i }));
    return screen;
  };

  test("opens the popover with a search field and preloaded gifs", async () => {
    open();
    expect(screen.getByPlaceholderText(/pesquisar|search/i)).toBeTruthy();
    await waitFor(() => {
      const img = screen.getByAltText("Wow") as HTMLImageElement;
      expect(img.src).toBe("https://media.giphy.com/s.gif");
    });
  });

  test("clicking a gif calls onPick with the full url and closes the popover", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    fireEvent.click(screen.getByAltText("Wow"));
    expect(onPick).toHaveBeenCalledWith("https://media.giphy.com/big.gif");
    await waitFor(() => expect(screen.queryByPlaceholderText(/pesquisar|search/i)).toBeNull());
  });

  test("debounces search by 300ms", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    const input = screen.getByPlaceholderText(/pesquisar|search/i);
    const trendingCalls = (global.fetch as jest.Mock).mock.calls.length;
    fireEvent.change(input, { target: { value: "cats" } });
    jest.advanceTimersByTime(250);
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(trendingCalls); // nothing for 250ms
    await act(async () => jest.advanceTimersByTimeAsync(100)); // completes the 300ms
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(trendingCalls + 1);
  });

  test("renders only the latest query result", async () => {
    open();
    await waitFor(() => screen.getByAltText("Wow"));
    let resolveSlow!: (r: { ok: boolean; json: () => Promise<{ gifs: GifResult[] }> }) => void;
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveSlow = resolve; })) // "ca" answer: slow
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ gifs: [cats] }) }); // "cats" answer: fast
    const input = screen.getByPlaceholderText(/pesquisar|search/i);
    fireEvent.change(input, { target: { value: "ca" } });
    await act(async () => jest.advanceTimersByTimeAsync(300));
    fireEvent.change(input, { target: { value: "cats" } });
    await act(async () => jest.advanceTimersByTimeAsync(300));
    await waitFor(() => screen.getByAltText("Cats")); // latest query's result is visible
    await act(async () => resolveSlow({ ok: true, json: () => Promise.resolve({ gifs: [{ ...gif, id: "old", title: "Old" }] }) }));
    expect(screen.queryByAltText("Old")).toBeNull(); // late answer must not override
  });

  test("shows empty state when search has no results", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({ gifs: [] }) });
    open();
    await waitFor(() => expect(screen.getByText(/no gifs|nenhum/i)).toBeTruthy());  });
});
