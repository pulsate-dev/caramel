import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";

import { FollowAccount } from "~/components/followAccount";
import { account } from "~/lib/api/account";
import { getFollowersList, type FollowerResponse } from "~/lib/api/followlist";
import { getToken } from "~/lib/api/getToken";
import { cloudflareContext, getApiBasePath } from "~/lib/cloudflareContext";

export async function loader({
  params,
  request,
  context,
}: LoaderFunctionArgs): Promise<
  { isSuccess: false } | { isSuccess: true; response: FollowerResponse[] }
> {
  const basePath = getApiBasePath(
    context.get(cloudflareContext).env.API_BASE_URL
  );
  const isLoggedIn = await getToken(request);

  if (!isLoggedIn.isLoggedIn) {
    throw redirect("/login");
  }
  const token = isLoggedIn.token;

  const accountRes = await account(params.id!, token, basePath);
  if ("error" in accountRes) {
    return { isSuccess: false };
  }

  return await getFollowersList(basePath, token, accountRes.id);
}

export default function Followers() {
  const loaderData = useLoaderData<typeof loader>();
  if (!loaderData.isSuccess) {
    return <>Failed to load Followers</>;
  }

  return (
    <>
      {loaderData.response.map((account) => (
        <FollowAccount key={account.id} {...account} />
      ))}
    </>
  );
}
