import type { LoaderFunctionArgs } from "react-router";
import { redirect, useLoaderData } from "react-router";
import { Note } from "~/components/note";
import { ReplyForm } from "~/components/replyForm";
import { getToken } from "~/lib/api/getToken";
import type { GetV0NotesIdResponse } from "@pulsate-dev/exp-api-types";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<Response | { note: GetV0NotesIdResponse }> => {
  const isLoggedIn = await getToken(request);
  if (!isLoggedIn.isLoggedIn) {
    return redirect("/login");
  }

  const noteID = params.id;
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
  return { note };
};

export default function RenotePage() {
  const { note } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>引用リノート</h1>
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
        loggedInAccountID=""
      />
      <ReplyForm noteID={note.id} action="/api/renote" />
    </div>
  );
}
