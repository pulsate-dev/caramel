import {
  GetV0AccountsIdentifierResponse,
  GetV0TimelineAccountsIdResponse,
} from "@pulsate-dev/exp-api-types";
import { TimelineResponse } from "~/lib/api/timeline";

export interface AccountResponse {
  id: string;
  name: string;
  nickname: string;
  bio: string;
  avatar: string;
  header: string;
  followed_count: number;
  following_count: number;
  note_count: number;
}

export const account = async (
  identifier: string,
  token: string | undefined,
  basePath: string
): Promise<AccountResponse | { error: string }> => {
  try {
    const res = await fetch(`${basePath}/v0/accounts/${identifier}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      switch (res.status) {
        case 500:
          return { error: "internal server error" };
        case 404:
          return { error: "account not found" };
        default:
          return { error: "unknown error" };
      }
    }

    const repsonse = (await res.json()) as GetV0AccountsIdentifierResponse;

    return {
      id: repsonse.id,
      name: repsonse.name,
      nickname: repsonse.nickname,
      bio: repsonse.bio,
      avatar: repsonse.avatar,
      header: repsonse.header,
      followed_count: repsonse.followed_count,
      following_count: repsonse.following_count,
      note_count: repsonse.note_count,
    } satisfies AccountResponse;
  } catch {
    return { error: "unknown error" };
  }
};

export const accountTimeline = async (
  id: string,
  token: string | undefined,
  basePath: string,
  beforeID?: string
): Promise<TimelineResponse[] | { error: string }> => {
  try {
    const url = new URL(`${basePath}/v0/timeline/accounts/${id}`);
    if (beforeID) {
      url.searchParams.append("before_id", beforeID);
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return (await res.json()) as { error: string };
    }

    const response = (await res.json()) as GetV0TimelineAccountsIdResponse;

    return response.map(
      (item) =>
        ({
          id: item.id,
          content: item.content,
          contents_warning_comment: item.contents_warning_comment,
          visibility: item.visibility as "PUBLIC" | "HOME" | "FOLLOWERS",
          created_at: new Date(item.created_at),
          author: {
            id: item.author.id,
            name: item.author.name,
            display_name: item.author.display_name,
            bio: item.author.bio,
            avatar: item.author.avatar,
            header: item.author.header,
            followed_count: item.author.followed_count,
            following_count: item.author.following_count,
          },
          reactions: item.reactions.map(
            (reaction): TimelineResponse["reactions"][number] => ({
              emoji: reaction.emoji,
              reacted_by: reaction.reacted_by,
            })
          ),
        }) satisfies TimelineResponse
    );
  } catch {
    return { error: "unknown error" };
  }
};
