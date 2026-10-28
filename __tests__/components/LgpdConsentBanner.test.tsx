import { render, screen, act } from "@testing-library/react";
import { LgpdConsentBanner } from "@/components/LgpdConsentBanner";
import { LanguageProvider } from "@/context/LanguageContext";

function renderBanner() {
  return render(
    <LanguageProvider>
      <LgpdConsentBanner />
    </LanguageProvider>
  );
}

describe("LgpdConsentBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the notice in pt-BR by default", () => {
    renderBanner();
    expect(screen.getByText("Política de Privacidade")).toBeTruthy();
    expect(screen.getByText("Termos de Uso")).toBeTruthy();
    expect(screen.getByText("Entendi")).toBeTruthy();
  });

  it("switches to English when EN is selected and persists the locale", () => {
    renderBanner();
    act(() => {
      screen.getByText("EN").click();
    });
    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(screen.getByText("Got it")).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("anonyzap:locale") || "")).toBe("en");
  });
});
