export type TokenPayload = {
  /**
   * User Name
   * @example "@username@example.com"
   */
  name: string;
  /**
   * User ID
   * @example "1239478928734"
   */
  id: string;
};

/**
 * Parse Access token.
 * @description NOTE(SECURITY): **This function do not validate token, just parse it.**
 * @param token
 */
export const parseToken = (token: string): TokenPayload | Error => {
  const split = token.split(".");
  const decodedPayload = atob(split[1]);
  try {
    const payload = JSON.parse(decodedPayload);
    return {
      name: payload.accountName,
      id: payload.sub,
    };
  } catch (e) {
    console.log(e);
    return new Error("failed to parse", { cause: e });
  }
};
