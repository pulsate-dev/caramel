import { AccountResponse } from "~/lib/account";
import { useEffect, useState } from "react";

export const useAccount = (
  id: string
): { account: AccountResponse | undefined; error: string } => {
  const [account, setAccount] = useState<AccountResponse>();
  const [error, setError] = useState<string>("loading...");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchAccount = async (id: string) => {
      try {
        const res = await fetch(`http://localhost:3000/accounts/${id}`, {
          signal: abortController.signal,
        });
        if (!res.ok) {
          // ToDo: return error messages (defined in the API)
          return setError("Failed to fetch account");
        }
        const account = await res.json();

        return setAccount({
          id: account.id,
          name: account.name,
          nickname: account.display_name,
          bio: account.bio,
          avatar: account.avatar,
          header: account.header,
          followedCount: account.followed_count,
          followingCount: account.following_count,
          createdAt: new Date(account.created_at),
        });
      } catch (e) {
        if (e instanceof Error) {
          return setError(e.message);
        }
        setError("unknown error");
      }
    };
    fetchAccount(id);
    return () => {
      abortController.abort();
    };
  }, []);

  return {
    account,
    error,
  };
};
