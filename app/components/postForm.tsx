import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { action } from "~/routes/api.notes";

export const PostForm = () => {
  const [content, setContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.state === "loading") {
      if ("error" in fetcher.data) {
        setErrorMessage(fetcher.data.error ?? "uncaught error");
        return;
      }
      setContent("");
    }
  }, [fetcher.state]);

  return (
    <fetcher.Form method="post" action="/api/notes">
      <textarea
        required
        name="content"
        id="content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      ></textarea>
      <select id="visibility" name="visibility">
        <option value="PUBLIC">Public</option>
        <option value="HOME">Home</option>
        <option value="FOLLOWERS">Followers</option>
      </select>
      <button type="submit">Submit</button>
      <p>{errorMessage}</p>
    </fetcher.Form>
  );
};
