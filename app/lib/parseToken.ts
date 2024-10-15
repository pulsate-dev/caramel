/**
 * Parse access token\
 * NOTE(warning): this function don't check JWT signature.
 * @param token
 */
export const parseToken = (token: string): {name: string; id: string} => {
  const {accountName, sub} = JSON.parse(atob(token.split(".")[1]));
  console.log(accountName, sub);
  return {name: accountName, id: sub};
}
