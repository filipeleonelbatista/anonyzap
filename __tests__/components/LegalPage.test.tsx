import { render, screen, act } from "@testing-library/react";
import { PrivacyContent } from "@/components/LegalPage";
import { LanguageProvider, useI18n } from "@/context/LanguageContext";

function Switcher() {
  const { setLocale } = useI18n();
  return <button onClick={() => setLocale("en")}>set-en</button>;
}

describe("LegalPage (privacy)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders in pt-BR by default", () => {
    render(
      <LanguageProvider>
        <PrivacyContent />
      </LanguageProvider>
    );
    expect(screen.getByText("Política de Privacidade")).toBeTruthy();
    expect(
      screen.getByText("8. Transferência internacional e operadores")
    ).toBeTruthy();
  });

  it("switches to English without reload and keeps the same sections", () => {
    render(
      <LanguageProvider>
        <PrivacyContent />
        <Switcher />
      </LanguageProvider>
    );
    act(() => {
      screen.getByText("set-en").click();
    });
    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(
      screen.getByText("8. International transfer and operators")
    ).toBeTruthy();
    expect(
      screen.getByText("In case of discrepancy, the Portuguese version prevails.")
    ).toBeTruthy();
  });
});
