# Typescript Lab

## **An unexpected (not really) journey**: *from Javascript to Typescript*

### First steps

Before we start working and writing code, we need to set up our environment. We need to:

- Install and setup Typescript
- Set up lint


### Typescript

We just had to install ```typescript``` package. We did it just for this project but it was advised to install globally.


### Linter

#### First impressions

Making a quick search, we see that TSLint was the equivalent for ESLint for Typescript, but [it's going to be deprecated]( https://github.com/palantir/tslint/issues/4534) during this same year (I'm writing this on July 2019).

Looks like good news. TSLint will stop accepting features and from Juanary 1st 2019 they will only accept security fixes.

The plan is moving to ESLint, so both Javascript and Typescript are rules will be determined by the same people and share a core (one core to rule them all).

Actually TypeScript itself decided to move from TSLint to ESLint. [Their own experience]((https://github.com/microsoft/TypeScript/issues/30553)) might come in handy.

#### First decisions

After this initial search, we come to an [article](https://medium.com/@myylow/how-to-keep-the-airbnb-eslint-config-when-moving-to-typescript-1abb26adb5c6) that we'll be using as our first approach.

#### First questions

> After installing packages as recommended by the article, we are said to **update** our ```.eslintrc``` file, but what content should already have that file? Any at all? It's not explained so we can't be totally sure.

<details>
<summary>Answer</summary>
Looks like it that's all we needed. We started seeing some Lint warnings and errors after just completing the steps from the article
</details>

> Lint related packages need to be installed as ```dependencies``` or is it enough to install them as ```devDependencies```?

<details>
<summary>Answer</summary>
We just tried with ```devDependencies``` and seems to be working, so that's the answer for now.
</details>

#### Other interesting links

- https://blog.matterhorn.dev/posts/learn-typescript-linting-part-1/

#### Thoughts about moving forward

Well, as basic as it sound, I forgot to start with the most important: getting Typescript. I just added this point above for good reading reasons, but once I had the ESLint with Typescript plugins theoretically working I realized we were missing Typescript itself.

After our first code fragment to test our Linter we saw that an untyped parameter in a function was only showing up a small warning. According to our basic knowledge of Typescript and the reasons behind our journey, we had no doubt we needed that case to show up like an error.

So we came to our next stop: settings.

### Settings

After our first steps we got Typescript and a proper Linter working. Now it's time to find proper settings and information about them.

We'll be looking for Typescript recommended settings first and the we'll look for recommended lint settings (hopefully I'll find something from Airbnb).

So this is where we find that we are missing the Typescript config file, that should be named ```tsconfig.json``` and placed on root folder as most config files.

Content is an object and its main property is ```compilerOptions```.

As a start, we are using default settings from a clean Typescript installation. Once we add this config including ```strict: true``` we finally see the untyped parameter showing up as an error.

We'll keep using standard settings as long as we don't feel the need to change anything. So, for this first version, our ```tsconfig.json``` file looks like this:

```json
{
  "compilerOptions": {
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    // "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    // "outDir": "./",                        /* Redirect output structure to the directory. */
    "rootDir": "src",                         /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. */
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

Regarding Linter, we just added some default options along with some other options mainly related to Airbnb and Prettier integration. All taken from the article and also [the typescript-eslint readme](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin).

So our initial ```.eslintrc``` file looks like this (we added all the recommended rules on typescript-eslint documentation):

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx",
      ".ts",
      ".tsx"
    ],
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx"
      ]
    },
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  "rules": {
    "indent": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/camelcase": "error",
    "@typescript-eslint/class-name-casing": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/interface-name-prefix": "error",
    "@typescript-eslint/member-delimiter-style": "error",
    "@typescript-eslint/no-angle-bracket-type-assertion": "error",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-object-literal-type-assertion": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/type-annotation-spacing": "error"
  }
}
```

