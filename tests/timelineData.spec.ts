import { expect, test } from "@playwright/test";

import type { TimelineResponse } from "../app/lib/api/timeline";
import { toNoteProps } from "../app/lib/timeline";

const note: TimelineResponse = {
  id: "note",
  content: "content",
  contents_warning_comment: "warning",
  visibility: "PUBLIC",
  created_at: new Date("2026-01-01"),
  author: {
    id: "author",
    name: "alice",
    display_name: "Alice",
    bio: "",
    avatar: "avatar.png",
    header: "",
    followed_count: 0,
    following_count: 0,
  },
  reactions: [{ emoji: "👍", reacted_by: "viewer" }],
};

test("converts a regular note to display props", () => {
  expect(toNoteProps(note, "viewer", [])).toEqual({
    id: "note",
    content: "content",
    contentsWarningComment: "warning",
    author: { avatar: "avatar.png", name: "alice", nickname: "Alice" },
    reactions: [{ emoji: "👍", reactedBy: "viewer" }],
    loggedInAccountID: "viewer",
    renoteInfo: undefined,
  });
});

test("converts a renote with its original author and content", () => {
  const original: TimelineResponse = {
    ...note,
    id: "original",
    content: "original content",
    contents_warning_comment: "original warning",
    author: { ...note.author, name: "bob", display_name: "Bob" },
  };
  const props = toNoteProps(
    { ...note, original_note_id: original.id },
    "viewer",
    [note, original]
  );

  expect(props.renoteInfo).toEqual({
    renoteBy: { avatar: "avatar.png", name: "alice", nickname: "Alice" },
    originalAuthor: { avatar: "avatar.png", name: "bob", nickname: "Bob" },
    originalContent: "original content",
    originalCWComment: "original warning",
  });
  expect(props.id).toBe(note.id);
});

test("keeps the note displayable when the original note is unavailable", () => {
  expect(
    toNoteProps({ ...note, original_note_id: "missing" }, "viewer", [])
  ).toEqual(toNoteProps(note, "viewer", []));
});
