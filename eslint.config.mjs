import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "public/**",
      "out/**",
      "coverage/**",
      "dist/**",
    ],
    files: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "components/**/*.ts",
      "components/**/*.tsx",
      "context/**/*.ts",
      "context/**/*.tsx",
      "hook/**/*.ts",
      "hook/**/*.tsx",
      "hooks/**/*.ts",
      "hooks/**/*.tsx",
      "lib/**/*.ts",
      "lib/**/*.tsx",
      "types/**/*.ts",
      "tests/**/*.ts",
      "tests/**/*.tsx",
    ],
  },
];

export default eslintConfig;
