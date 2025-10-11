export interface AccountRelationshipResponse {
  id: string;
  isFollowed: boolean;
  isFollowing: boolean;
  isFollowRequesting: boolean;
}

export async function accountRelationship(
  basePath: string,
  token: string,
  accountID: string
): Promise<
  | { isSuccess: true; response: AccountRelationshipResponse }
  | { isSuccess: false }
> {
  try {
    const relationshipRes = await fetch(
      new URL(`/v0/accounts/${accountID}/relationships`, basePath),
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!relationshipRes.ok) {
      return { isSuccess: false };
    }

    // ToDo: exp-api-typesの型を使う
    const relationship = (await relationshipRes.json()) as {
      id: string;
      is_followed: boolean;
      is_following: boolean;
      is_follow_requesting: boolean;
    };

    return {
      isSuccess: true,
      response: {
        id: relationship.id,
        isFollowed: relationship.is_followed,
        isFollowing: relationship.is_following,
        isFollowRequesting: relationship.is_follow_requesting,
      },
    };
  } catch {
    return { isSuccess: false };
  }
}
