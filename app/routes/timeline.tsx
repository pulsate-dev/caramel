import { MetaFunction } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Note } from "~/components/note";
import styles from "~/styles/timeline.module.css";

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

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export default function Timeline() {
  const [notes, setNotes] = useState<HomeTimelineResponse[]>();
  const [error, setError] = useState<string>("loading...");
  useEffect(() => {
    const fetchTimeline = async () => {
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
    };
    fetchTimeline();
  }, []);

  return (
    <div className={styles.noteContainer}>
      {notes ? (
        notes.map((note) => {
          const author = {
            avatar: note.author.avatar,
            name: note.author.name,
            nickname: note.author.display_name,
          };
          return (
            <Note
              key={note.id}
              author={author}
              content={note.content}
              contentsWarningComment={note.contents_warning_comment}
            />
          );
        })
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
}
