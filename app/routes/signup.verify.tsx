import type { LoaderFunctionArgs} from "react-router";
import { Link, useLoaderData } from "react-router";

export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<{ error: string } | { status: "ok" }> => {
  const query = new URL(request.url).searchParams;

  const token = query.get("token");
  const accountName = query.get("name");
  if (!token || !accountName) {
    return {
      error: "Token or Account name not set",
    };
  }
  try {
    const res = await fetch(
      `http://localhost:3000/v0/accounts/${accountName}/verify_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      }
    );

    if (!res.ok) {
      switch (res.status) {
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
    console.error(e);
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
