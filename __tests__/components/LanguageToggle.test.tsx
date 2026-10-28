import { render, screen, act } from "@testing-library/react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LanguageProvider } from "@/context/LanguageContext";

function renderToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  );
}

describe("LanguageToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens a dropdown with the three languages and marks the current one", () => {
    renderToggle();
    act(() => {
      screen.getByRole("button", { name: /idioma/i }).click();
    });
    const ptOption = screen.getByRole("menuitemradio", { name: "Português" });
    expect(screen.getByRole("menuitemradio", { name: "English" })).toBeTruthy();
    expect(screen.getByRole("menuitemradio", { name: "Español" })).toBeTruthy();
    expect(ptOption.getAttribute("aria-checked")).toBe("true");
    expect(
      screen.getByRole("menuitemradio", { name: "English" }).getAttribute("aria-checked")
    ).toBe("false");
  });

  it("switches to English and persists the choice", () => {
    renderToggle();
    act(() => {
      screen.getByRole("button", { name: /idioma/i }).click();
    });
    act(() => {
      screen.getByRole("menuitemradio", { name: "English" }).click();
    });
    expect(JSON.parse(localStorage.getItem("anonyzap:locale") || "")).toBe("en");
    // menu closes after selection
    expect(screen.queryByRole("menuitemradio", { name: "English" })).toBeNull();
  });

  it("closes the dropdown on Escape", () => {
    renderToggle();
    act(() => {
      screen.getByRole("button", { name: /idioma/i }).click();
    });
    expect(screen.getByRole("menu", { name: /idioma/i })).toBeTruthy();
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      );
    });
    expect(screen.queryByRole("menu", { name: /idioma/i })).toBeNull();
  });
});
