import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

import type { NoteReaction } from "~/components/note.types";
import type { action } from "~/routes/api.reaction";

interface UseReactionProps {
  noteID: string;
  reactions: readonly NoteReaction[];
  loggedInAccountID: string;
}

export function useReaction({
  noteID,
  reactions,
  loggedInAccountID,
}: UseReactionProps) {
  const fetcher = useFetcher<typeof action>();
  const [isReacted, setIsReacted] = useState(() =>
    reactions.some((reaction) => reaction.reactedBy === loggedInAccountID)
  );
  const previousReacted = useRef<boolean | null>(null);

  useEffect(() => {
    if (fetcher.state !== "idle" || previousReacted.current === null) return;

    if (!fetcher.data || "error" in fetcher.data) {
      setIsReacted(previousReacted.current);
    }
    previousReacted.current = null;
  }, [fetcher.data, fetcher.state]);

  const toggleReaction = async (emoji: string) => {
    if (fetcher.state !== "idle" || previousReacted.current !== null) return;

    const wasReacted = isReacted;
    previousReacted.current = wasReacted;
    setIsReacted(!wasReacted);

    if (wasReacted) {
      await fetcher.submit(
        { noteID },
        { method: "delete", action: "/api/reaction" }
      );
      return;
    }

    await fetcher.submit(
      { emoji, noteID },
      { method: "post", action: "/api/reaction" }
    );
  };

  return {
    isReacted,
    isPending: fetcher.state !== "idle",
    toggleReaction,
  };
}
