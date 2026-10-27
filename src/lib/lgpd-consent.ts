/** localStorage key for LGPD / privacy notice acknowledgment */
export const LGPD_CONSENT_STORAGE_KEY = "anonyzap:privacy-notice-ack";

/** Pre-rename key; migrated on read via migrateStorageKey */
export const LGPD_CONSENT_LEGACY_KEY = "chat-anywhere:privacy-notice-ack";

/** CSS custom property set on `document.documentElement` while the banner is visible */
export const LGPD_BANNER_CSS_VAR = "--lgpd-banner";

/** Reserved vertical space so fixed banner does not cover the chat input */
export const LGPD_BANNER_SPACER = "7.25rem";
