import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";

import type { NoteReaction } from "~/components/note.types";
import { useReaction } from "~/hooks/useReaction";
import type { action as renoteAction } from "~/routes/api.renote";

export interface NoteActionsProps {
  noteId: string;
  reactions: readonly NoteReaction[];
  loggedInAccountID: string;
}

export function NoteActions({
  noteId,
  reactions,
  loggedInAccountID,
}: NoteActionsProps) {
  const renoteFetcher = useFetcher<typeof renoteAction>();
  const isRenotePending = useRef(false);
  const { isReacted, isPending, toggleReaction } = useReaction({
    noteID: noteId,
    reactions,
    loggedInAccountID,
  });

  useEffect(() => {
    if (renoteFetcher.state === "idle") {
      isRenotePending.current = false;
    }
  }, [renoteFetcher.state]);

  const handleRenote = async () => {
    if (renoteFetcher.state !== "idle" || isRenotePending.current) return;

    isRenotePending.current = true;

    await renoteFetcher.submit(
      { noteID: noteId },
      { method: "post", action: "/api/renote" }
    );
  };

  return (
    <div>
      <button
        type="button"
        disabled={renoteFetcher.state !== "idle"}
        onClick={() => void handleRenote()}
      >
        Renote
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => void toggleReaction("👍")}
      >
        👍 {reactions.length}{" "}
        {isReacted ? <span>(reacted)</span> : <span></span>}
      </button>
    </div>
  );
}
