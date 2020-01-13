import path from 'path';
import ts from 'typescript';

import { APIModule } from '../../model/api';
import { ApiNamespace } from '../../model/client';
import api from '../api';
import getFrameworkPath from '../../tools/getFrameworkPath';
import getImports from './getImports';
import getMethod from './getMethod';
import getMethodWrapper from './getMethodWrapper';
import getApiObjectText from './getApiObjectText';
import updateApiObject from './updateApiObject';
import packagesImports from './packagesImports';
import fs from '../../util/fs';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';

import settings from '../../config/settings';

const { modelPath } = settings;

const toUpperFirst = (src: string): string => `${src.charAt(0).toUpperCase()}${src.slice(1)}`;

const getMethodName = (key: string): string =>
  key
    .split('.')
    .map((k, i): string => (i ? toUpperFirst(k) : k))
    .join('');

const getDocs = (mod: APIModule): string => {
  if (
    mod.compilerInfo &&
    mod.compilerInfo.mainMethodDocs &&
    mod.compilerInfo.mainMethodDocs.jsDoc &&
    mod.compilerInfo.mainMethodDocs.jsDoc.length
  ) {
    return mod.compilerInfo.mainMethodDocs.jsDoc[0].getFullText();
  }
  return '';
};

const getInternalImports = (): string => [
  `import * as model from '../${modelPath}';`,
  `import socket from './socket';`,
  `import { MethodCall, SocketMessage } from '../dist/';`,
  `import { getModule } from 'a2r';`
].join('\n');

const build = async (): Promise<string> => {
  const frameworkPath = await getFrameworkPath();
  const filePath = path.resolve(frameworkPath, 'api', 'index.ts');
  out.verbose(`Building Client API at ${fullPath(filePath)}`);
  const fileDir = path.dirname(filePath);
  const entries = Object.entries(api);
  const methods: string[] = [];
  let apiObject: ApiNamespace = {
    key: 'api',
    namespaces: [],
    methods: [],
  };

  const sourceFile = ts.createSourceFile(
    filePath,
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed,  });
  for (let i = 0, l = entries.length; i < l; i += 1) {
    const [key, mod] = entries[i];
    const methodName = getMethodName(key);
    const docs = getDocs(mod);
    const method = getMethod(
      printer,
      sourceFile,
      key,
      methodName,
      mod.compilerInfo.mainMethodParamNodes,
      mod.compilerInfo.mainMethodReturnTypeInfo,
    );
    out.verbose(`Method ${key} content:\n${[docs, method].join('\n')}`);
    methods.push([docs, method].join('\n'));
    apiObject = updateApiObject(apiObject, key.split('.'), methodName);
  }
  out.verbose(`API Object content:\n${getApiObjectText(apiObject)}`);
  const content = [
    getImports(printer, sourceFile, fileDir, packagesImports),
    getInternalImports(),
    getMethodWrapper(),
    ...methods,
    getApiObjectText(apiObject),
    'export default api;\n',
  ].join('\n\n');

  await fs.writeFile(filePath, content);
  delete require.cache[filePath];
  out.verbose('Client API Built!');
  return filePath;
};

export default build;
