import path from 'path';
import ts from 'typescript';

import api, { APIModule } from '../api';
import { ApiNamespace } from './client-api';
import getImports from './getImports';
import getMethod from './getMethod';
import getMethodWrapper from './getMethodWrapper';
import getApiObjectText from './getApiObjectText';
import updateApiObject from './updateApiObject';
import frameworkImports from './frameworkImports';
import packagesImports from './packagesImports';
import fs from '../../util/fs';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';

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

const build = async (filePath: string): Promise<void> => {
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
    true,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
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
    getImports(printer, sourceFile, fileDir, frameworkImports),
    getMethodWrapper(),
    ...methods,
    getApiObjectText(apiObject),
    'export default api;\n',
  ].join('\n\n');

  await fs.writeFile(filePath, content);
  out.verbose('Client API Built!');
};

export default build;
