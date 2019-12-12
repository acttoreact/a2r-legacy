# A2R Style  <!-- omit in toc -->

- [Generic typescript file style](#generic-typescript-file-style)
  - [Imports blocks](#imports-blocks)
  - [Main variables block](#main-variables-block)
  - [Code block](#code-block)
  - [Export block](#export-block)
  - [Sample file](#sample-file)

## Generic typescript file style

### Imports blocks

Imports are divided in three blocks, following this order:

- Node.js and external modules
- Internal modules
- Settings or imported variables

Personally I like to separate each block, obtaining the following result:

```ts
import path from 'path';

import out from '../../util/out';
import getProjectPath from '../../tools/getProjectPath';
import { fullPath } from '../../util/terminalStyles';

import settings from '../../config/settings';
```

> NOTE: Also take into account that we follow [this eslint rule](https://github.com/benmosher/eslint-plugin-import/blob/v2.19.1/docs/rules/order.md)

### Main variables block

After imports, main variables (the ones shared between different methods on our file). Extracting needed props from settings is the most common example

```ts
const { modelPath } = settings;
```

### Code block

Well, not much to say... just write great code on this block!

### Export block

Way too obvious, but you know... don't forget to export if you are writing a module!

### Sample file

According to our style tips, resulting file should look something like this:

```ts
// Imports blocks
import path from 'path';

import out from '../../util/out';
import getProjectPath from '../../tools/getProjectPath';
import { fullPath } from '../../util/terminalStyles';

import settings from '../../config/settings';

// Main variables block
const { modelPath } = settings;

// Code block
const build = async (): Promise<void> => {
  out.verbose('Building Model');
  const projectPath = await getProjectPath();
  const modelProjectPath = path.resolve(projectPath, modelPath);
  out.verbose(`Model project path: ${fullPath(modelProjectPath)}`);
  // [Awesome code here, I'd have to kill you before sharing it]
};

// Export block
export default build;

```
