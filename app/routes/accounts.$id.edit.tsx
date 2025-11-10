import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { account, updateAccount } from "~/lib/api/account";
import { getToken } from "~/lib/api/getToken";
import { loggedInAccount } from "~/lib/api/loggedInAccount";

const ERROR_MESSAGES = {
  invalidRequest: "Invalid request. Please try again.",
  accountNotFound: "Account not found.",
  internalServerError: "Internal server error. Please try again later.",
  unknownError: "Unknown error occurred.",
} as const;

type ActionData = {
  error: (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
};

type LoaderData =
  | {
      error: undefined;
      account: {
        id: string;
        name: string;
        nickname: string;
        bio: string;
      };
    }
  | {
      error: string;
    };

export const meta: MetaFunction<typeof loader> = () => [
    { title: "Edit Account | Caramel" },
    { content: "noindex" },
];

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const tokenData = await getToken(request);
  if (!tokenData.isLoggedIn) {
    throw redirect("/login");
  }
  const token = tokenData.token;

  if (!params.id) return { error: ERROR_MESSAGES.accountNotFound };

  const accountRes = await account(params.id, token, basePath);
  if ("error" in accountRes) {
    return { error: accountRes.error };
  }

  const loggedInAccountData = await loggedInAccount(request, basePath);
  if (!loggedInAccountData.isSuccess) {
    throw redirect("/login");
  }

  if (loggedInAccountData.response.id !== accountRes.id) {
    throw redirect("/login");
  }

  return {
    error: undefined,
    account: {
      id: accountRes.id,
      name: accountRes.name,
      nickname: accountRes.nickname,
      bio: accountRes.bio,
    },
  };
};

export const action = async ({ request, params, context }: ActionFunctionArgs) => {
  const basePath = (context.cloudflare.env as Env).API_BASE_URL;

  const tokenData = await getToken(request);
  if (!tokenData.isLoggedIn) {
    throw redirect("/login");
  }
  const token = tokenData.token;

  if (!params.id) {
    return { error: ERROR_MESSAGES.accountNotFound } satisfies ActionData;
  }

  const loggedInAccountData = await loggedInAccount(request, basePath);
  if (!loggedInAccountData.isSuccess) {
    throw redirect("/login");
  }

  const accountRes = await account(params.id, token, basePath);
  if ("error" in accountRes) {
    return { error: ERROR_MESSAGES.accountNotFound } satisfies ActionData;
  }

  if (loggedInAccountData.response.id !== accountRes.id) {
    throw redirect("/login");
  }

  const formData = await request.formData();
  const nickname = formData.get("nickname") as string;
  const bio = formData.get("bio") as string;

  const res = await updateAccount(
    basePath,
    accountRes.name,
    bio,
    nickname || undefined,
    token
  );

if ("error" in res) {
    const errorMessage = ERROR_MESSAGES[res.error as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.unknownError;
    return { error: errorMessage } satisfies ActionData;
  }

  return redirect(`/accounts/${accountRes.name}`);
};

export default function AccountEdit() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const errorMessage = actionData?.error;

  if (loaderData.error !== undefined) {
    return (
      <div style={{ padding: "1rem" }}>
        <p>{loaderData.error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Edit Account</h1>
      <p style={{ marginBottom: "1rem" }}>
        {loaderData.account.nickname} ({loaderData.account.name})
      </p>

      <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="nickname">Nickname</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            defaultValue={loaderData.account.nickname}
            placeholder="Nickname"
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={loaderData.account.bio}
            placeholder="Tell us about yourself"
            rows={5}
          />
        </div>

        {errorMessage ? (
          <p role="alert" style={{ color: "red" }}>
            {errorMessage}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit">Update</button>
          <a href={`/accounts/${loaderData.account.name}`}>
            <button type="button">Cancel</button>
          </a>
        </div>
      </Form>
    </div>
  );
}
