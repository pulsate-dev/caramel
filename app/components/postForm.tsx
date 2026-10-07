import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

import type { action } from "~/routes/api.notes";

export const PostForm = () => {
  const [content, setContent] = useState<string>("");
  const fetcher = useFetcher<typeof action>();
  const errorMessage =
    fetcher.state === "loading" && fetcher.data && fetcher.data.status !== "ok"
      ? (fetcher.data.message ?? "uncaught error")
      : "";

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.state === "loading" && fetcher.data.status === "ok") {
      setContent("");
    }
  }, [fetcher.state, fetcher.data]);

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
