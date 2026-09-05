import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { followAccount, unfollowAccount } from "~/lib/api/follow";
import { getToken } from "~/lib/api/getToken";
import { checkOrigin, throwForbiddenResponse } from "~/lib/checkOrigin";
import { cloudflareContext, getApiBasePath } from "~/lib/cloudflareContext";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (!checkOrigin(request)) {
    throwForbiddenResponse();
  }

  const auth = await getToken(request);
  if (!auth.isLoggedIn) {
    throw redirect("/login");
  }
  const token = auth.token;

  try {
    const formData = await request.formData();
    const basePath = getApiBasePath(
      context.get(cloudflareContext).env.API_BASE_URL
    );

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
        return { error: "method not allowed" };
      }
    }
  } catch {
    return { error: "something went wrong" };
  }
};
