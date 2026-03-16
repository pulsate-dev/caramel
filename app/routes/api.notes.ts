import type { ActionFunctionArgs } from "react-router";
import { getToken } from "~/lib/api/getToken";

export const action = async ({ request, context }: ActionFunctionArgs): Promise<{status: "error"; message: string} | {status: "ok"}> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return { status: "error", message: "unauthorized" };
  }
  const token = isLoggedIn.token;

  try {
    const formData = await request.formData();
    const basePath = (context.cloudflare.env as Env).API_BASE_URL;
    const res = await fetch(new URL("/v0/notes", basePath), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: formData.get("content"),
        visibility: formData.get("visibility"),
        attachment_file_ids: [],
        contents_warning_comment: "",
      }),
    });

    if (!res.ok) {
      const errorRes = (await res.json()) as { error: string };
      return { status: "error", message: errorRes.error };
    }

    return { status: "ok" };
  } catch (e) {
    if (e instanceof Error) {
      return { status: "error",message: e.message };
    }
    return { status: "error",message: "unknown error" };
  }
};
