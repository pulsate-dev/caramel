import { postV0NotesIdRenote } from "@pulsate-dev/exp-api-types";

import { logger } from "../logger";
import { apiOptions } from "./client";

export interface RenoteArgs {
  content: string;
  visibility: "PUBLIC" | "HOME";
  attachment_file_ids: string[];
  contents_warning_comment: string;
}

export async function renote(
  basePath: string,
  token: string,
  originalNoteID: string,
  args: RenoteArgs
): Promise<{ isSuccess: boolean }> {
  try {
    const { error } = await postV0NotesIdRenote({
      ...apiOptions(
        basePath,
        token,
        `/v0/notes/${encodeURIComponent(originalNoteID)}/renote`
      ),
      body: args,
      path: { id: originalNoteID },
    });
    if (error) {
      logger.error("failed to renote", { args, error });
      return { isSuccess: false };
    }
  } catch (e) {
    logger.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}
