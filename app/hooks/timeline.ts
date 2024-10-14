import { useEffect, useState } from "react";

interface HomeTimelineResponse {
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
}

export const useHomeTimeline = () => {
  const [notes, setNotes] = useState<HomeTimelineResponse[]>();
  const [error, setError] = useState<string>("loading...");

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const timelineRes = await fetch("http://localhost:3000/timeline/home", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!timelineRes.ok) {
          const errorJSON = await timelineRes.json();
          return setError(errorJSON.error);
        }
        const timelineData = (await timelineRes.json()) as HomeTimelineResponse[];
        setNotes(timelineData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
        setError("unknown error");
      }
    };
    fetchTimeline();
  }, []);

  return {
    notes: notes,
    error: error,
  }
};
