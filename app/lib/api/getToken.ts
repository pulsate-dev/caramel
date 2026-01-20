import { accountCookie } from "./login";

/**
 * Returns account Access Token.
 */
export async function getToken(
  request: Request<unknown, CfProperties<unknown>>
): Promise<{ isLoggedIn: true; token: string } | { isLoggedIn: false }> {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { isLoggedIn: false };
  }

  return { isLoggedIn: true, token };
}
