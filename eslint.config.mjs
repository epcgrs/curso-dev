import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";

const compat = new FlatCompat({ baseDirectory: path.resolve() });

export default [
  { ignores: ["node_modules/**", ".next/**", "coverage/**"] },
  js.configs.recommended,
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "plugin:jest/recommended",
      "plugin:prettier/recommended",
    ],
    env: { node: true, browser: true, jest: true },
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    overrides: [
      {
        files: ["tests/**/*.{js,jsx,ts,tsx}"],
        env: { jest: true, node: true },
      },
      { files: ["infra/**/*.{js,ts}"], env: { node: true } },
    ],
  }),
];
