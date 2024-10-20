import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { accountCookie } from "~/lib/login";

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<{ error: string } | null> => {
  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    return { error: "unauthorized" };
  }

  const formData = await request.formData();

  switch (request.method) {
    case "POST":
      return await reaction(
        formData.get("noteID") as string,
        formData.get("emoji") as string,
        cookie
      );
    case "DELETE":
      return await unDoReaction(formData.get("noteID") as string, cookie);
    default:
      return { error: "method not allowed" };
  }
};

export const reaction = async (
  noteID: string,
  emoji: string,
  token: string
) => {
  try {
    const res = await fetch(`http://localhost:3000/notes/${noteID}/reaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emoji }),
    });

    if (!res.ok) {
      throw new Error("Failed to react");
    }

    return null;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};

export const unDoReaction = async (noteID: string, token: string) => {
  try {
    const res = await fetch(`http://localhost:3000/notes/${noteID}/reaction`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res);

    if (!res.ok) {
      throw new Error("Failed to undo reaction");
    }

    return null;
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};
