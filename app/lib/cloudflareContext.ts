import { createContext } from "react-router";

export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

export const requireApiBasePath = (basePath: string | undefined): string => {
  if (!basePath) {
    throw new Error("API_BASE_URL env was not configured");
  }
  return basePath;
};
