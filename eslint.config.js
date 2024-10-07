import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {files: ["app/**/*.{ts,tsx}"]},
  {ignores: ["build/**", "node_modules/**"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      }
    }
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    }
  },
  eslintConfigPrettier
];