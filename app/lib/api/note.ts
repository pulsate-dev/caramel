export interface NoteResponse {
  id: string;
  content: string;
  contents_warning_comment: string;
  visibility: "PUBLIC" | "HOME" | "FOLLOWERS";
  created_at: Date;
  author: {
    id: string;
    name: string;
    display_name: string;
    bio: string;
    avatar: string;
    header: string;
    followed_count: number;
    following_count: number;
  };
  reactions: {
    emoji: string;
    reacted_by: string;
  }[];
  original_note_id?: string;
}

export const fetchNoteById = async (
  noteId: string,
  token: string,
  basePath: string
): Promise<NoteResponse | { error: string }> => {
  try {
    const url = new URL(`/v0/notes/${noteId}`, basePath);

    const noteRes = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!noteRes.ok) {
      return { error: `Failed to fetch note: ${noteRes.status}` };
    }

    const note = (await noteRes.json()) as NoteResponse;
    return note;
  } catch {
    return { error: "unknown error" };
  }
};
