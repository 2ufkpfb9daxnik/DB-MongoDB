import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // ① 全体に適用される基本設定
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // ② *.mongosh.js 専用の追記
  {
    files: ["**/*.mongosh.js"],
    languageOptions: {
      globals: {
        db: "readonly",
        printjson: "readonly",
      },
    },
  },
];
