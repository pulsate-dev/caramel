import { postV0Notes } from "@pulsate-dev/exp-api-types";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { apiOptions, parseApiErrorMessage } from "~/lib/api/client";
import { getToken } from "~/lib/api/getToken";
import { checkOrigin, throwForbiddenResponse } from "~/lib/checkOrigin";
import { cloudflareContext, getApiBasePath } from "~/lib/cloudflareContext";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (!checkOrigin(request)) {
    throwForbiddenResponse();
  }

  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    throw redirect("/login");
  }
  const token = isLoggedIn.token;

  try {
    const formData = await request.formData();
    const basePath = getApiBasePath(
      context.get(cloudflareContext).env.API_BASE_URL
    );
    const { error } = await postV0Notes({
      ...apiOptions(basePath, token),
      body: {
        content: formData.get("content") as string,
        visibility: formData.get("visibility") as string,
        attachment_file_ids: [],
        contents_warning_comment: "",
      },
    });

    if (error) {
      return { status: "error", message: parseApiErrorMessage(error) };
    }

    return { status: "ok" };
  } catch (e) {
    if (e instanceof Error) {
      return { status: "error", message: e.message };
    }
    return { status: "error", message: "unknown error" };
  }
};
