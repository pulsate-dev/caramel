import {
  deleteV0NotesIdReaction,
  postV0NotesIdReaction,
} from "@pulsate-dev/exp-api-types";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { apiOptions } from "~/lib/api/client";
import { getToken } from "~/lib/api/getToken";
import { checkOrigin, throwForbiddenResponse } from "~/lib/checkOrigin";
import { cloudflareContext } from "~/lib/cloudflareContext";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (!checkOrigin(request)) {
    throwForbiddenResponse();
  }

  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    throw redirect("/login");
  }
  const token = isLoggedIn.token;

  const formData = await request.formData();
  const basePath = context.get(cloudflareContext).env.API_BASE_URL;

  switch (request.method) {
    case "POST":
      return await reaction(
        formData.get("noteID") as string,
        formData.get("emoji") as string,
        token,
        basePath
      );
    case "DELETE":
      return await undoReaction(
        formData.get("noteID") as string,
        token,
        basePath
      );
    default:
      return { error: "method not allowed" };
  }
};

const reaction = async (
  noteID: string,
  emoji: string,
  token: string,
  basePath: string
): Promise<{ status: string } | { error: string }> => {
  try {
    const { error } = await postV0NotesIdReaction({
      ...apiOptions(basePath, token),
      body: { emoji },
      path: { id: noteID },
    });

    if (error) {
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
  token: string,
  basePath: string
): Promise<{ status: string } | { error: string }> => {
  try {
    const { error } = await deleteV0NotesIdReaction({
      ...apiOptions(basePath, token),
      path: { id: noteID },
    });

    if (error) {
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
