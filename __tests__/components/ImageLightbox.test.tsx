import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageLightbox } from "@/components/ImageLightbox";
import { LanguageProvider } from "@/context/LanguageContext";

function renderLightbox(onClose: jest.Mock) {
  return render(
    <LanguageProvider>
      <ImageLightbox src="https://example.com/img.png" onClose={onClose} />
    </LanguageProvider>
  );
}

describe("ImageLightbox", () => {
  const getScale = (): number => {
    const img = document.body.querySelector("img");
    const match = /scale\(([\d.]+)\)/.exec(img?.style.transform ?? "");
    return match ? Number(match[1]) : 1;
  };

  it("zooms in and out with the buttons", () => {
    const onClose = jest.fn();
    const { container } = renderLightbox(onClose);
    expect(getScale(container)).toBe(1);

    const zoomIn = screen.getByRole("button", { name: "Aumentar zoom" });
    fireEvent.click(zoomIn);
    fireEvent.click(zoomIn);
    expect(getScale(container)).toBe(2);

    fireEvent.click(screen.getByRole("button", { name: "Reduzir zoom" }));
    expect(getScale(container)).toBe(1.5);
  });

  it("closes on Escape and on the close button", () => {
    const onClose = jest.fn();
    const { container } = renderLightbox(onClose);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(container).toBeDefined();
  });
});
