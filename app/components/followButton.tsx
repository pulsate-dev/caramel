import { useEffect, useState } from "react";
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
  const [isFollowing, setIsFollowing] = useState(relationship.isFollowing);

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.state === "loading") {
      if ("error" in fetcher.data) {
        if (fetcher.formMethod === "POST") setIsFollowing(false);
        if (fetcher.formMethod === "DELETE")
          setIsFollowing(relationship.isFollowing);
      }
    }
  }, [fetcher.state, fetcher.data, fetcher.formMethod]);

  const handleFollow = async () => {
    await fetcher.submit(
      { accountName: accountName },
      { method: "post", action: "/api/follow" }
    );
    setIsFollowing(true);
  };
  const handleUnfollow = async () => {
    await fetcher.submit(
      { accountName: accountName },
      { method: "delete", action: "/api/follow" }
    );
    setIsFollowing(false);
  };

  /**
   * フォローしている(isFollowing): フォロー解除
   * フォローしていない(!isFollowing): フォロー
   * フォローリクエスト中(isFollowRequesting): リクエスト中
   * フォローしていないが，相手からフォローされている(isFollowed && !isFollowing): フォローバック
   */
  const buttonText = (() => {
    if (relationship.isFollowRequesting) {
      return "Follow requesting";
    } else if (!isFollowing && relationship.isFollowed) {
      return "Follow back";
    } else if (!isFollowing) {
      return "Follow";
    } else {
      return "Unfollow";
    }
  })();

  return (
    <button
      onClick={() => {
        if (isFollowing) {
          handleUnfollow();
        } else {
          handleFollow();
        }
      }}
    >
      {buttonText}
    </button>
  );
}
