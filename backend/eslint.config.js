import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
    {
        ignores: ["dist/**", "node_modules/**", "eslint.config.js"]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.{ts,tsx,js}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", {
                "args": "all",
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],

            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",

            "no-console": "warn",
        },
    }
);