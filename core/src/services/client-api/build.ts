import ts from 'typescript';

import api, { APIModule } from '../api';
import { ReturnTypeInfo } from '../compiler';
import fs from '../../util/fs';
import out from '../../util/out';

const neededFrameworkImports = ['SocketMessage', 'MethodCall', 'getSocket', 'out'];

const toUpperFirst = (src: string): string => `${src.charAt(0).toUpperCase}${src.slice(1)}`;

const getMethodName = (key: string): string =>
  key
    .split('.')
    .map(toUpperFirst)
    .join('');

const getMethodReturnType = (returnTypeInfo?: ReturnTypeInfo | null): ts.TypeNode => {
  if (returnTypeInfo) {
    if (returnTypeInfo.isTypeReference) {
      // TODO: Treat type references (imports?)
    }
    return returnTypeInfo.typeNode as ts.TypeNode;
  }
  return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
};

interface ParamInfo {
  declarationNode: ts.ParameterDeclaration;
  identifier: ts.Identifier;
}

const getParam = (paramNode: ts.ParameterDeclaration): ParamInfo => {
  const children = paramNode.getChildren();

  return {
    identifier: children[0] as ts.Identifier,
    declarationNode: ts.createParameter(
      undefined,
      undefined,
      undefined,
      children[0] as ts.Identifier,
      undefined,
      children[1] as ts.TypeNode,
      undefined,
    ),
  };
};

const getMethod = (
  key: string,
  methodName: string,
  paramNodes: ts.ParameterDeclaration[],
  returnTypeInfo?: ReturnTypeInfo | null,
): string => {
  const params = paramNodes.map((param): ParamInfo => getParam(param));
  return ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          ts.createIdentifier(methodName),
          undefined,
          ts.createArrowFunction(
            undefined,
            undefined,
            params.map((param): ts.ParameterDeclaration => param.declarationNode),
            ts.createTypeReferenceNode(ts.createIdentifier('Promise'), [
              getMethodReturnType(returnTypeInfo),
            ]),
            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.createCall(ts.createIdentifier('methodWrapper'), undefined, [
              ts.createStringLiteral(key),
              ...params.map((param): ts.Identifier => param.identifier),
            ]),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    )
    .getText();
};

const getImport = (): string => {
  return ts
    .createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        undefined,
        ts.createNamedImports(
          neededFrameworkImports.map(
            (name): ts.ImportSpecifier =>
              ts.createImportSpecifier(undefined, ts.createIdentifier(name)),
          ),
        ),
      ),
      ts.createStringLiteral('a2r/client'),
    )
    .getText();
};

interface ApiMethod {
  key: string;
  methodName: string;
}

interface ApiNamespace {
  key: string;
  namespaces: ApiNamespace[];
  methods: ApiMethod[];
}

const updateApiObject = (
  structure: ApiNamespace,
  keys: string[],
  methodName: string,
): ApiNamespace => {
  const lastIndex = keys.length - 1;
  return keys.reduce(
    (t: ApiNamespace, key: string, i: number): ApiNamespace => {
      if (i === lastIndex) {
        t.methods.push({
          key,
          methodName,
        });
        return t;
      }
      let namespace = t.namespaces.find((n): boolean => n.key === key);
      if (!namespace) {
        namespace = {
          key,
          namespaces: [],
          methods: [],
        };
        t.namespaces.push(namespace);
      }
      return namespace;
    },
    { ...structure },
  );
};

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

const getMethodWrapper = (): string => {
  return `const methodWrapper = (method: string, ...args: any[]): Promise<any> =>
  new Promise<SocketMessage>((resolve, reject): void => {
    const socket = getSocket();

    if (socket) {
      const id = generateId();
      socket.on(id, (res: SocketMessage): void => {
        socket.off(id);
        if (res.o) {
          resolve(res.d);
        } else {
          const error = new Error(res.e);
          error.stack = res.s;
          reject(error);
        }
      });

      const call: MethodCall = {
        method,
        id,
        params: args,
      };
      
      socket.emit('*', call);
    } else {
      out.error('No client socket available!');
    }
  });`;
};

const namespaceToText = (namespace: ApiNamespace, level: number = 0): string => {
  const namespaces = namespace.namespaces.map((n): string => {
    return `${Array(level).fill('\t').join('')}${n.key}: {
    ${Array(level + 1).fill('\t').join('')}${namespaceToText(n, level + 1)}
    ${Array(level).fill('\t').join('')}}`;
  });
  const methods = namespace.methods.map((m): string => {
    return `${Array(level).fill('\t').join('')}${m.key}: ${m.methodName}`;
  });
  return [...namespaces, ...methods].join('\n');
};

const getApiObjectText = (apiObject: ApiNamespace): string => {
  return `const api = {
    ${namespaceToText(apiObject)}
  };`;
};

const build = async (filePath: string): Promise<void> => {
  out.verbose('Building Client API...');
  const entries = Object.entries(api);
  const methods: string[] = [];
  let apiObject: ApiNamespace = {
    key: 'api',
    namespaces: [],
    methods: [],
  };
  const sourceFile = ts.createSourceFile(filePath, '', ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  for (let i = 0, l = entries.length; i < l; i += 1) {
    const [key, mod] = entries[i];
    const methodName = getMethodName(key);
    const docs = getDocs(mod);
    const method = getMethod(
      key,
      methodName,
      mod.compilerInfo.mainMethodParamNodes,
      mod.compilerInfo.mainMethodReturnTypeInfo,
    );
    methods.push([docs, method].join('\n'));
    apiObject = updateApiObject(apiObject, key.split('.'), methodName);
  }
  const defaultExport = 'export default api';
  const content = [getImport(), getMethodWrapper(), ...methods, getApiObjectText(apiObject), defaultExport].join('\n');
  await fs.writeFile(filePath, content);
  out.verbose('Client API Built!');
};

export default build;
