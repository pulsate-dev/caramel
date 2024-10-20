import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { action } from "~/routes/api.notes.create";

export const PostForm = () => {
  const [content, setContent] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.state === "loading") {
      if ("error" in fetcher.data) {
        return setErrorMessage(fetcher.data.error);
      }
      setContent("");
    }
  }, [fetcher.state]);

  return (
    <fetcher.Form method="post" action="/api/notes/create">
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
