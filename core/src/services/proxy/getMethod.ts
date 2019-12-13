import ts from 'typescript';

import { ParamInfo } from '../../model/client';
import { ReturnTypeInfo } from '../compiler';
import out from '../../util/out';

import settings from '../../config/settings';

const { modelPath } = settings;

const getTypeNode = (node: ts.TypeNode): ts.TypeNode => {
  const child = node.getChildAt(0);
  if (ts.isIdentifier(child)) {
    return ts.createTypeReferenceNode(
      ts.createQualifiedName(
        ts.createIdentifier(modelPath),
        ts.createIdentifier(node.getText()),
      ),
      undefined,
    );
  }
  return node;
}

const getMethodReturnType = (returnTypeInfo?: ReturnTypeInfo | null): ts.TypeNode => {
  if (returnTypeInfo) {
    out.verbose(`Return Type Info type: ${returnTypeInfo.type}`);
    out.verbose(`Return Type Info typeNode: ${returnTypeInfo.typeNode}`);
    if (returnTypeInfo.typeNode) {
      out.verbose(`Return Type Info typeNode text: ${returnTypeInfo.typeNode.getText()}`);
      return getTypeNode(returnTypeInfo.typeNode);
    }
  }
  return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
};

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
  printer: ts.Printer,
  sourceFile: ts.SourceFile,
  key: string,
  methodName: string,
  paramNodes: ts.ParameterDeclaration[],
  returnTypeInfo?: ReturnTypeInfo | null,
): string => {
  const params = paramNodes.map((param): ParamInfo => getParam(param));
  const node = ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
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
    ),
  );

  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
};

export default getMethod;
