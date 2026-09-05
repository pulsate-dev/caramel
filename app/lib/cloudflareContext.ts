import { createContext } from "react-router";

export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

export const getApiBasePath = (basePath: string | undefined): string =>
  basePath ?? "http://localhost:3000";
