import type { ActionFunctionArgs } from "react-router";
import { getToken } from "~/lib/api/getToken";

export const action = async ({
  request,
  context,
}: ActionFunctionArgs): Promise<{ error: string } | { status: string }> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { error: "unauthorized" };
  }
  const token = isLoggedIn.token;

  try {
    const formData = await request.formData();
    const noteID = formData.get("noteID") as string;
    const content = formData.get("content") as string | null;
    const visibility = formData.get("visibility") as string | null;

    const basePath = (context.cloudflare.env as Env).API_BASE_URL;
    const res = await fetch(new URL(`/v0/notes/${noteID}/renote`, basePath), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content || "",
        visibility: visibility || "PUBLIC",
        attachment_file_ids: [],
        contents_warning_comment: "",
      }),
    });

    if (!res.ok) {
      const errorRes = (await res.json()) as { error: string };
      return { error: errorRes.error };
    }

    return { status: "ok" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};
