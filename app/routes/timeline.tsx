import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data, Form, redirect, useLoaderData, useSubmit } from "react-router";

import { EmptyState } from "~/components/emptyState";
import { NoteTimeline } from "~/components/noteTimeline";
import { PostForm } from "~/components/postForm";
import { loggedInAccount } from "~/lib/api/loggedInAccount";
import { accountCookie } from "~/lib/api/login";
import { fetchOriginalNotes } from "~/lib/api/note";
import type { TimelineResponse, TimelineType } from "~/lib/api/timeline";
import { fetchTimeline } from "~/lib/api/timeline";
import { cloudflareContext } from "~/lib/cloudflareContext";

import styles from "~/styles/timeline.module.css";

export const meta: MetaFunction = () => {
  return [{ title: "Timeline | Caramel" }, { content: "noindex" }];
};

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<
  | { error: string }
  | {
      notes: TimelineResponse[];
      loggedInAccountID: string;
      originalNotes: TimelineResponse[];
      timeline: TimelineType;
    }
> => {
  const basePath = context.get(cloudflareContext).env.API_BASE_URL;

  const cookie = await accountCookie.parse(request.headers.get("Cookie"));
  if (!cookie) {
    throw redirect("/login");
  }

  const query = new URL(request.url).searchParams;
  const timeline: TimelineType =
    query.get("timeline") === "public" ? "public" : "home";
  const beforeID = query.get("before_id") ?? undefined;
  const afterID = query.get("after_id") ?? undefined;
  if (beforeID && afterID) {
    throw data("before_id and after_id cannot be used together", {
      status: 400,
    });
  }
  const res = await fetchTimeline(
    cookie,
    basePath,
    timeline,
    beforeID,
    afterID
  );
  if ("error" in res) {
    return res;
  }
  if (afterID && res.notes.length === 0) {
    throw redirect(`/timeline?timeline=${timeline}`);
  }

  const loggedInAccountDatum = await loggedInAccount(request, basePath);
  if (!loggedInAccountDatum.isSuccess) {
    throw redirect("/login");
  }

  const originalNotes = await fetchOriginalNotes(res.notes, cookie, basePath);

  return {
    notes: res.notes,
    loggedInAccountID: loggedInAccountDatum.response.id,
    originalNotes,
    timeline,
  };
};

export default function Timeline() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();
  if ("error" in loaderData) {
    return <div>{loaderData.error}</div>;
  }

  const emptyStateDescription =
    loaderData.timeline === "public"
      ? "Public notes will appear here."
      : "Notes from accounts you follow will appear here. Your notes will also appear here.";

  return (
    <div className={styles.noteContainer}>
      <div>
        <Form method="get">
          <label htmlFor="timeline">
            Timeline:{" "}
            <select
              id="timeline"
              name="timeline"
              value={loaderData.timeline}
              onChange={(event) => submit(event.currentTarget.form)}
            >
              <option value="home">Home</option>
              <option value="public">Public</option>
            </select>
          </label>
        </Form>
        <PostForm />
      </div>

      {loaderData.notes.length === 0 ? (
        <EmptyState emoji="💭">
          <h3>No notes here</h3>
          <p>{emptyStateDescription}</p>
        </EmptyState>
      ) : (
        <NoteTimeline
          notes={loaderData.notes}
          loggedInAccountID={loaderData.loggedInAccountID}
          originalNotes={loaderData.originalNotes}
          timeline={loaderData.timeline}
        />
      )}
    </div>
  );
}
