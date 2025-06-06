import { account } from "./account";
import { accountCookie } from "./login";
import { parseToken } from "./parseToken";

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
  request: Request<unknown, CfProperties<unknown>>
): Promise<LoggedInAccountResponse> {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { isSuccess: false };
  }

  const parsedToken = parseToken(token);
  if (parsedToken instanceof Error) {
    return { isSuccess: false };
  }

  const accountDatum = await account(parsedToken.id, token);
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
