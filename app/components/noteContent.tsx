export function NoteContent({
  contentsWarningComment,
  content,
}: {
  contentsWarningComment: string;
  content: string;
}) {
  return contentsWarningComment.length !== 0 ? (
    <details>
      <summary>{contentsWarningComment}</summary>
      <p>{content}</p>
    </details>
  ) : (
    <p>{content}</p>
  );
}
