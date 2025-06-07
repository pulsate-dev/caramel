import type { ActionFunctionArgs } from "react-router";
import { accountCookie } from "~/lib/api/login";

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<{ error: string } | { status: string }> => {
  const token = await accountCookie.parse(request.headers.get("Cookie"));
  if (!token) {
    return { error: "unauthorized" };
  }

  const formData = await request.formData();

  switch (request.method) {
    case "POST":
      return await reaction(
        formData.get("noteID") as string,
        formData.get("emoji") as string,
        token
      );
    case "DELETE":
      return await undoReaction(formData.get("noteID") as string, token);
    default:
      return { error: "method not allowed" };
  }
};

const reaction = async (
  noteID: string,
  emoji: string,
  token: string
): Promise<{ status: string } | { error: string }> => {
  try {
    const res = await fetch(
      `http://localhost:3000/v0/notes/${noteID}/reaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to react");
    }

    return { status: "ok" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};

const undoReaction = async (
  noteID: string,
  token: string
): Promise<{ status: string } | { error: string }> => {
  try {
    const res = await fetch(
      `http://localhost:3000/v0/notes/${noteID}/reaction`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to undo reaction");
    }

    return { status: "ok" };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};
