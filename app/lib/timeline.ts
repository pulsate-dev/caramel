export interface TimelineResponse {
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
}

export const fetchHomeTimeline = async (
  token: string
): Promise<{ notes: TimelineResponse[] } | { error: string }> => {
  try {
    const timelineRes = await fetch("http://localhost:3000/timeline/home", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    if (!timelineRes.ok) {
      return (await timelineRes.json()) as { error: string };
    }
    const notes = (await timelineRes.json()) as TimelineResponse[];
    return { notes };
  } catch {
    return { error: "unknown error" };
  }
};
