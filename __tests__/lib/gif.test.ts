// GIF picker server-side gate: env IS_GIF_ENABLED must be set (and not "false")
// AND GIPHY_API_KEY must exist, otherwise the picker button is hidden.
/**
 * @jest-environment node
 */
import { isGifPickerEnabled } from "@/lib/gif";

describe("isGifPickerEnabled", () => {
  const old = { flag: process.env.IS_GIF_ENABLED, key: process.env.GIPHY_API_KEY };
  afterEach(() => {
    process.env.IS_GIF_ENABLED = old.flag;
    process.env.GIPHY_API_KEY = old.key;
  });

  test("enabled when flag is true and key is set", () => {
    process.env.IS_GIF_ENABLED = "true";
    process.env.GIPHY_API_KEY = "k";
    expect(isGifPickerEnabled()).toBe(true);
  });

  test("disabled when flag is set but key is missing", () => {
    process.env.IS_GIF_ENABLED = "true";
    delete process.env.GIPHY_API_KEY;
    expect(isGifPickerEnabled()).toBe(false);
  });

  test("disabled when flag is unset but key is set", () => {
    delete process.env.IS_GIF_ENABLED;
    process.env.GIPHY_API_KEY = "k";
    expect(isGifPickerEnabled()).toBe(false);
  });

  test('treats "false" as off, not as on', () => {
    process.env.IS_GIF_ENABLED = "false";
    process.env.GIPHY_API_KEY = "k";
    expect(isGifPickerEnabled()).toBe(false);
  });
});
