import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["app/**/*.{ts,tsx}"] },
  { ignores: ["build/**", "node_modules/**", ".react-router/**"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintConfigPrettier,
];
