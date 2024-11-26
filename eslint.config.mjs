import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [ "**/*.{js,mjs,cjs,ts}" ],
    rules: {
      "array-bracket-spacing": [ "error", "always" ],
      "object-curly-spacing": [ "error", "always" ],
      "space-in-parens": [ "error", "always" ],
      "max-len": [ "error", { 
        "code": 80,
        "tabWidth": 2,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      } ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-inferrable-types": "off"
    }
  },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended
];