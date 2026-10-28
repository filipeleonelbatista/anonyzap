// Feature gate for the GIF picker, read server-side at request time.
// The button renders only when the env flag is set (and not "false")
// AND the GIPHY key exists (GIPHY free beta key: 100 req/hour).
export function isGifPickerEnabled(): boolean {
  const flag = process.env.IS_GIF_ENABLED;
  return !!process.env.GIPHY_API_KEY && !!flag && flag !== "false";
}
