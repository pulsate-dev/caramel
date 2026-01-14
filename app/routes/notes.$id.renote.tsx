import type { GetV0NotesIdResponse } from "@pulsate-dev/exp-api-types";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { Note } from "~/components/note";
import { getToken } from "~/lib/api/getToken";
import { loggedInAccount } from "~/lib/api/loggedInAccount";
import styles from "~/styles/renote.module.css";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<
  Response | { note: GetV0NotesIdResponse; loggedInAccountID: string }
> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return redirect("/login");
  }

  const noteID = params.id;
  if (!noteID) {
    throw new Error("Note ID is required");
  }

  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const res = await fetch(new URL(`/v0/notes/${noteID}`, basePath), {
    headers: {
      Authorization: `Bearer ${isLoggedIn.token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }

  const note = (await res.json()) as GetV0NotesIdResponse;

  const loggedInAccountDatum = await loggedInAccount(request, basePath);
  if (!loggedInAccountDatum.isSuccess) {
    return redirect("/login");
  }

  return { note, loggedInAccountID: loggedInAccountDatum.response.id };
};

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;
  const noteID = params.id;

  if (!noteID) {
    return { error: "Note ID is required" };
  }

  const basePath = (context.cloudflare.env as Env).API_BASE_URL;
  const res = await fetch(new URL(`/v0/notes/${noteID}/renote`, basePath), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${isLoggedIn.token}`,
    },
    body: JSON.stringify({
      content: content || "",
      visibility: "PUBLIC",
      attachment_file_ids: [],
      contents_warning_comment: "",
    }),
  });

  if (!res.ok) {
    const errorRes = (await res.json()) as { error: string };
    return { error: errorRes.error };
  }

  return redirect("/timeline");
};

export default function RenotePage() {
  const { note, loggedInAccountID } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quote</h1>
      <Form method="post" className={styles.form}>
        {actionData && "error" in actionData && (
          <div className={styles.error}>Error: {actionData.error}</div>
        )}
        <textarea
          name="content"
          placeholder="Add a comment..."
          rows={4}
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitButton}>
          Quote
        </button>
      </Form>
      <div className={styles.previewLabel}>Original note:</div>
      <Note
        id={note.id}
        content={note.content}
        contentsWarningComment={note.contents_warning_comment}
        author={{
          avatar: note.author.avatar,
          name: note.author.name,
          nickname: note.author.display_name,
        }}
        reactions={note.reactions}
        loggedInAccountID={loggedInAccountID}
      />
    </div>
  );
}
