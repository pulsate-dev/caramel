import { useFetcher } from "react-router";
import type { AccountRelationshipResponse } from "~/lib/api/relationship";
import type { action } from "~/routes/api.follow";

export function FollowButton({
  accountName,
  relationship,
}: {
  accountName: string;
  relationship: AccountRelationshipResponse;
}) {
  const fetcher = useFetcher<typeof action>();

  /**
   * フォローしている(isFollowing): フォロー解除
   * フォローしていない(!isFollowing): フォロー
   * フォローリクエスト中(isFollowRequesting): リクエスト中
   * フォローしていないが，相手からフォローされている(isFollowed && !isFollowing): フォローバック
   */
  const buttonText = (() => {
    if (relationship.isFollowRequesting) {
      return "Follow requesting";
    } else if (!relationship.isFollowing && relationship.isFollowed) {
      return "Follow back";
    } else if (!relationship.isFollowing) {
      return "Follow";
    } else {
      return "Unfollow";
    }
  })();

  return (
    <button
      onClick={() => {
        if (relationship.isFollowing) {
          fetcher.submit(
            { accountName: accountName },
            { method: "post", action: "/api/follow" }
          );
        } else {
          fetcher.submit(
            { accountName: accountName },
            { method: "delete", action: "/api/follow" }
          );
        }
      }}
      disabled={fetcher.state !== "idle" || relationship.isFollowRequesting}
    >
      {buttonText}
    </button>
  );
}
