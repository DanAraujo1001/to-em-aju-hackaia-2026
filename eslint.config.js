import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import parser from "@typescript-eslint/parser";

export default defineConfig({
  ignores: ["dist"],
  files: ["**/*.{ts,tsx}"],
  extends: [js.configs.recommended],
  languageOptions: {
    parser,
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
    globals: globals.browser,
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
});
