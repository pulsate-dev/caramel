import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { accountCookie } from "~/lib/login";

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { error: "unauthorized" };
  }

  try {
    const formData = await request.formData();
    const res = await fetch("http://localhost:3000/notes", {
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
