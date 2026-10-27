import { migrateStorageKey } from "@/lib/storage-migration";

describe("migrateStorageKey", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("migrates the legacy value when the new key is absent", () => {
    localStorage.setItem("chat-anywhere:user", '{"id":"u1"}');

    const value = migrateStorageKey("anonyzap:user", "chat-anywhere:user");

    expect(value).toBe('{"id":"u1"}');
    expect(localStorage.getItem("anonyzap:user")).toBe('{"id":"u1"}');
    expect(localStorage.getItem("chat-anywhere:user")).toBeNull();
  });

  it("does not overwrite the new key when both exist", () => {
    localStorage.setItem("chat-anywhere:user", '{"id":"legacy"}');
    localStorage.setItem("anonyzap:user", '{"id":"current"}');

    const value = migrateStorageKey("anonyzap:user", "chat-anywhere:user");

    expect(value).toBe('{"id":"current"}');
    expect(localStorage.getItem("anonyzap:user")).toBe('{"id":"current"}');
    expect(localStorage.getItem("chat-anywhere:user")).toBeNull();
  });

  it("returns null and touches nothing when neither key exists", () => {
    const value = migrateStorageKey("anonyzap:user", "chat-anywhere:user");

    expect(value).toBeNull();
    expect(localStorage.getItem("anonyzap:user")).toBeNull();
  });

  it("migrates the LGPD consent key", () => {
    localStorage.setItem("chat-anywhere:privacy-notice-ack", "1");

    const value = migrateStorageKey(
      "anonyzap:privacy-notice-ack",
      "chat-anywhere:privacy-notice-ack"
    );

    expect(value).toBe("1");
    expect(localStorage.getItem("anonyzap:privacy-notice-ack")).toBe("1");
    expect(localStorage.getItem("chat-anywhere:privacy-notice-ack")).toBeNull();
  });

  it("survives a broken localStorage without throwing", () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });

    expect(() =>
      migrateStorageKey("anonyzap:user", "chat-anywhere:user")
    ).not.toThrow();
    expect(migrateStorageKey("anonyzap:user", "chat-anywhere:user")).toBeNull();

    getItemSpy.mockRestore();
  });
});
