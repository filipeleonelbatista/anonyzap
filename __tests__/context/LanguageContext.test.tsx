import { render, screen, act } from "@testing-library/react";
import { LanguageProvider, useI18n } from "@/context/LanguageContext";

function Probe() {
  const { locale, setLocale } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale("en")}>set-en</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to pt-BR", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("pt-BR");
  });

  it("persists the chosen locale in localStorage", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    act(() => {
      screen.getByText("set-en").click();
    });
    expect(JSON.parse(localStorage.getItem("anonyzap:locale") || "")).toBe("en");
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });

  it("detects Spanish from navigator.language on first visit", () => {
    const originalLanguage = navigator.language;
    Object.defineProperty(navigator, "language", {
      value: "es-ES",
      configurable: true,
    });
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("es");
    Object.defineProperty(navigator, "language", {
      value: originalLanguage,
      configurable: true,
    });
  });

  it("throws when useI18n is used outside the provider", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow(
      "useI18n must be used within a LanguageProvider"
    );
    consoleError.mockRestore();
  });
});
