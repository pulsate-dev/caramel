export interface AccountResponse {
  id: string;
  name: string;
  nickname: string;
  bio: string;
  avatar: string;
  header: string;
  followedCount: number;
  followingCount: number;
  createdAt: Date;
}


export const getAccount = async (
  id: string
): Promise<{ error: string } | AccountResponse> => {
  try {
    const res = await fetch(`http://localhost:3000/accounts/${id}`);
    if (!res.ok) {
      // ToDo: return error messages (defined in the API)
      throw new Error("Failed to fetch account");
    }
    const account = await res.json();

    return {
      id: account.id,
      name: account.name,
      nickname: account.display_name,
      bio: account.bio,
      avatar: account.avatar,
      header: account.header,
      followedCount: account.followed_count,
      followingCount: account.following_count,
      createdAt: new Date(account.created_at),
    };
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: "unknown error" };
  }
};
