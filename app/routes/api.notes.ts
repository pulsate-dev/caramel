import type { ActionFunctionArgs } from "react-router";
import { accountCookie } from "~/lib/api/login";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { error: "unauthorized" };
  }

  try {
    const formData = await request.formData();
    const basePath = (context.cloudflare.env as Env).API_BASE_URL;
    const res = await fetch(new URL(`/v0/notes`, basePath), {
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
