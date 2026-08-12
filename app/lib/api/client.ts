export const apiOptions = (baseUrl: string, token?: string, url?: string) => ({
  baseUrl,
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  signal: AbortSignal.timeout(10_000),
  ...(url ? { url } : {}),
});

export const parseApiErrorMessage = (error: unknown): string => {
  const message = (error as { error?: unknown } | null | undefined)?.error;
  return typeof message === "string" ? message : "unknown error";
};
