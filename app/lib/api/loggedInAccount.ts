import { parseToken } from "../parseToken";
import { account } from "./account";
import { getToken } from "./getToken";

export interface LoggedInAccountDatum {
  id: string;
  name: string;
  nickname: string;
  avatarURL: string;
  headerURL: string;
}

export type LoggedInAccountResponse =
  | {
      isSuccess: true;
      response: LoggedInAccountDatum;
    }
  | { isSuccess: false };

export async function loggedInAccount(
  request: Request<unknown, CfProperties<unknown>>,
  basePath: string
): Promise<LoggedInAccountResponse> {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { isSuccess: false };
  }
  const token = isLoggedIn.token;

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { isSuccess: false };
  }

  const accountDatum = await account(parsedToken.id, token, basePath);
  if ("error" in accountDatum) {
    return { isSuccess: false };
  }

  return {
    isSuccess: true,
    response: {
      id: accountDatum.id,
      name: accountDatum.name,
      nickname: accountDatum.nickname,
      avatarURL: accountDatum.avatar,
      headerURL: accountDatum.header,
    },
  };
}
