export async function followAccount(
  basePath: string,
  token: string,
  accountName: string
): Promise<{ isSuccess: boolean }> {
  try {
    const followRes = await fetch(
      new URL(`/v0/accounts/${accountName}/follow`, basePath),
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (!followRes.ok) {
      return { isSuccess: false };
    }
  } catch (e) {
    console.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}

export async function unfollowAccount(
  basePath: string,
  token: string,
  accountName: string
): Promise<{ isSuccess: boolean }> {
  try {
    const followRes = await fetch(
      new URL(`/v0/accounts/${accountName}/follow`, basePath),
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (followRes.status != 204) {
      return { isSuccess: false };
    }
  } catch (e) {
    console.error("Unexpected Error:", e);
    return { isSuccess: false };
  }

  return { isSuccess: true };
}
