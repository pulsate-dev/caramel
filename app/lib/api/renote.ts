export interface RenoteArgs {
  content: string;
  visibility: "PUBLIC" | "HOME" | "FOLLOWERS";
  attachment_file_ids: string[];
  contents_warning_comment: string;
}

export async function renote(
  basePath: string,
  token: string,
  originalNoteID: string,
  args: RenoteArgs
): Promise<{isSuccess: boolean}> {
  try {
    const res = await fetch(
      new URL(`/v0/notes/${originalNoteID}/renote`, basePath),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(args),
      }
    );

    if (!res.ok) {
      return { isSuccess: false };
    }
  } catch (e) {
    console.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}
