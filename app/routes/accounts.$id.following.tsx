import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { FollowAccount } from "~/components/followAccount";
import { account } from "~/lib/account";
import { getFollowingList, type FollowingResponse } from "~/lib/api/followlist";
import { getToken } from "~/lib/api/getToken";

export async function loader({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<
  { isSuccess: false } | { isSuccess: true; response: FollowingResponse[] }
> {
  const basePath = (context.cloudflare.env as Env).API_BASE_URL;
  const isLoggedIn = await getToken(request);

  if (!isLoggedIn.isLoggedIn) {
    return { isSuccess: false };
  }
  const token = isLoggedIn.token;

  const accountRes = await account(params.id!, token, basePath);
  if ("error" in accountRes) {
    return { isSuccess: false };
  }

  return await getFollowingList(basePath, token, accountRes.id);
}

export default function Followings() {
  const loaderData = useLoaderData<typeof loader>();
  if (!loaderData.isSuccess) {
    return <>Failed to load followings</>;
  }

  return (
    <>
      {loaderData.response.map((account) => (
        <FollowAccount key={account.id} {...account} />
      ))}
    </>
  );
}
