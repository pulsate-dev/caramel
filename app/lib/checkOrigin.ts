const FORBIDDEN_RESPONSE = JSON.stringify({ error: "forbidden" });

/**
 * Check the browser's fetch metadata before handling a cookie-authenticated
 * state-changing request.
 */
export const checkOrigin = (request: Request): boolean => {
  const originHeader = request.headers.get("Origin");
  if (!originHeader || originHeader === "null") {
    return false;
  }

  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite && fetchSite !== "same-origin") {
    return false;
  }

  try {
    return new URL(originHeader).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
};

export const forbiddenResponse = (): Response =>
  new Response(FORBIDDEN_RESPONSE, {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
