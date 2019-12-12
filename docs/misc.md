# Misc docs  <!-- omit in toc -->

- [Interesting articles or docs](#interesting-articles-or-docs)
- [Interesting libraries](#interesting-libraries)
- [Interesting learnings](#interesting-learnings)

## Interesting articles or docs

## Interesting libraries

- https://github.com/dsherret/ts-ast-viewer
- https://github.com/dsherret/ts-morph

## Interesting learnings

Everyone at the office was having problems with linter lately. I decided to clean `core` from everything related to linter, prettier and airbnb and start from scratch. I followed simple guide from most important library, [`typescript-estlint`](https://github.com/typescript-eslint/typescript-eslint#how-do-i-configure-my-project-to-use-typescript-eslint). I installed recommended versions and introduced recommended settings from every one of them.

I ended up with this libraries installed:

```json
  "@typescript-eslint/eslint-plugin": "^2.11.0",
  "@typescript-eslint/parser": "^2.11.0",
  "@typescript-eslint/typescript-estree": "^2.11.0",
  "eslint": "^6.1.0",
  "eslint-config-airbnb-base": "^14.0.0",
  "eslint-config-prettier": "^6.7.0",
  "eslint-plugin-import": "^2.19.1",
```

And this was my `.eslintrc`:

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "useJSXTextNode": true,
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "airbnb-base",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  "settings": {
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  "rules": {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
   ],
   "no-unused-vars": "off",
   "no-plusplus": "off",
   "no-underscore-dangle": "off",
   "@typescript-eslint/no-unused-vars": "error",
   "@typescript-eslint/adjacent-overload-signatures": "error",
   "@typescript-eslint/array-type": "error",
   "@typescript-eslint/ban-types": "error",
   "@typescript-eslint/camelcase": "error",
   "@typescript-eslint/class-name-casing": "error",
   "@typescript-eslint/consistent-type-definitions": "error",
   "@typescript-eslint/explicit-function-return-type": "error",
   "@typescript-eslint/explicit-member-accessibility": "error",
   "@typescript-eslint/member-delimiter-style": "error",
   "@typescript-eslint/no-array-constructor": "error",
   "@typescript-eslint/no-empty-interface": "error",
   "@typescript-eslint/no-explicit-any": "error",
   "@typescript-eslint/no-inferrable-types": "error",
   "@typescript-eslint/no-misused-new": "error",
   "@typescript-eslint/no-namespace": "error",
   "@typescript-eslint/no-non-null-assertion": "off",
   "@typescript-eslint/no-parameter-properties": "error",
   "@typescript-eslint/no-use-before-define": "error",
   "@typescript-eslint/no-var-requires": "error",
   "@typescript-eslint/prefer-namespace-keyword": "error",
   "@typescript-eslint/type-annotation-spacing": "error",
  }
}
```

About Prettier, I didn't need to change my `.prettierrc`. Looks like you only need to install `eslint-config-prettier` and configure eslint to use it as you can see above.

Anyway, here's my `.prettierrc` content:

```json
{
 "printWidth": 100,
 "tabWidth": 2,
 "singleQuote": true,
 "trailingComma": "all",
 "semi": true,
 "newline-before-return": true,
 "no-duplicate-variable": [true, "check-parameters"],
 "no-var-keyword": true
}
```
