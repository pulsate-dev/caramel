import type { ActionFunctionArgs } from "react-router";
import { getToken } from "~/lib/api/getToken";
import { renote } from "~/lib/api/renote";

export const action = async ({
  request,
  context,
}: ActionFunctionArgs): Promise<{ error: string } | { status: string }> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { error: "unauthorized" };
  }
  const token = isLoggedIn.token;

  if (request.method !== "POST") {
    return { error: "method not allowed" };
  }

  const formData = await request.formData();
  const noteID = formData.get("noteID") as string;

  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const result = await renote(basePath, token, noteID, {
    content: "",
    visibility: "PUBLIC",
    attachment_file_ids: [],
    contents_warning_comment: "",
  });

  if (!result.isSuccess) {
    return { error: "Failed to renote" };
  }

  return { status: "ok" };
};
