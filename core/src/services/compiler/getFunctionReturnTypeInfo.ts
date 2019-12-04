import ts from 'typescript';

import { ReturnTypeInfo } from './compiler';
// import isKeywordNode from '../../tools/isKeywordNode';
import out from '../../util/out';

const getTypeReference = (
  node: ts.Node,
): ts.TypeReferenceNode | null => {
  let typeReference: ts.TypeReferenceNode | null = null;
  const children = node.getChildren();
  for (let i = 0, l = children.length; i < l && !typeReference; i += 1) {
    const child = children[i];
    if (ts.isTypeReferenceNode(child)) {
      typeReference = child as ts.TypeReferenceNode;
    } else {
      typeReference = getTypeReference(child);
    }
  }
  return typeReference;
};

const getFunctionReturnTypeInfo = (
  node: ts.FunctionDeclaration | ts.ArrowFunction,
): ReturnTypeInfo | null => {
  let returnTypeInfo: ReturnTypeInfo | null = null;
  const typeReference = getTypeReference(node);
  if (typeReference) {
    const children = typeReference.getChildren();
    let identifier = '';
    let type = '';
    let typeNode: ts.Node | null = null;
    let isTypeReference = false;
    let typeReferencePath = '';
    for (let i = 0, l = children.length; i < l; i += 1) {
      const child = children[i];
      if (ts.isIdentifier(child)) {
        identifier = child.getText().trim();
      } else {
        type = child.getText().trim();
        typeNode = child;
        if (ts.isTypeReferenceNode(child)) {
          isTypeReference = true;
          // TODO: Check if type is imported and store type reference path
          typeReferencePath = 'test';
        } else if (ts.isArrayTypeNode(child)) {
          // TODO: Check if array type is primitive type
        }
        out.verbose(
          `Unknown node type looking for function return type ${
            ts.SyntaxKind[child.kind]
          }`,
        );
      }
    }
    returnTypeInfo = {
      identifier,
      type,
      typeNode,
      isTypeReference,
      typeReferencePath,
    };
  }
  return returnTypeInfo;
};

export default getFunctionReturnTypeInfo;
