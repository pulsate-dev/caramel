import { postV0AccountsNameVerifyEmail } from "@pulsate-dev/exp-api-types";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";

import { apiOptions } from "~/lib/api/client";
import { cloudflareContext, requireApiBasePath } from "~/lib/cloudflareContext";
import { logger } from "~/lib/logger";

export const loader = async ({
  request,
  context,
}: LoaderFunctionArgs): Promise<{ error: string } | { status: "ok" }> => {
  const query = new URL(request.url).searchParams;

  const token = query.get("token");
  const accountName = query.get("name");
  if (!token || !accountName) {
    return {
      error: "Token or Account name not set",
    };
  }
  if (accountName.length > 64) {
    throw new Response("Invalid account name", { status: 400 });
  }

  try {
    const basePath = requireApiBasePath(
      context.get(cloudflareContext).env.API_BASE_URL
    );
    if (basePath == null) {
      logger.error("API_BASE_URL env was not configured");
      return { error: "Something went wrong" };
    }
    const { error, response } = await postV0AccountsNameVerifyEmail({
      ...apiOptions(
        basePath,
        undefined,
        `/v0/accounts/${encodeURIComponent(accountName)}/verify_email`
      ),
      body: { token },
      path: { name: accountName },
    });

    if (error) {
      switch (response?.status) {
        case 400:
          return { error: "Verification token is invalid." };
        case 404:
          return { error: "Account or Token not found" };
        case 500:
          return { error: "Something went wrong" };
      }
    }

    return { status: "ok" };
  } catch (e) {
    logger.error("failed to send a verification email", e);
    return {
      error: "Something went wrong",
    };
  }
};

export default function EmailVerify() {
  const loaderData = useLoaderData<typeof loader>();
  if ("error" in loaderData) {
    return (
      <>
        <h2 color="red">Error: {loaderData.error}</h2>
        {/*ToDo: Encourage them to contact the administrator*/}
        <Link to="/">back to home</Link>
      </>
    );
  }

  return (
    <>
      Email Verify Success!
      <Link to="/">back to home</Link>
    </>
  );
}
