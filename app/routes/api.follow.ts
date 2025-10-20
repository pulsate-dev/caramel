import type { ActionFunctionArgs } from "react-router";
import { followAccount, unfollowAccount } from "~/lib/api/follow";
import { getToken } from "~/lib/api/getToken";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { error: "unauthorized" };
  }
  const token = isLoggedIn.token;

  try {
    const formData = await request.formData();
    const basePath = (context.cloudflare.env as Env).API_BASE_URL;

    switch (request.method) {
      case "POST": {
        return await followAccount(
          basePath,
          token,
          formData.get("accountName") as string
        );
      }
      case "DELETE": {
        return await unfollowAccount(
          basePath,
          token,
          formData.get("accountName") as string
        );
      }
      default: {
        return { error: "method not allowed"}
      }
    }
  } catch (e) {
    console.error(e);
    return { error: "something went wrong" };
  }
};
