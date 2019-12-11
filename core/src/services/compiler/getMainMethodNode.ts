import ts from 'typescript';

import getFunctionName from './getFunctionName';
import out from '../../util/out';

const getMainMethodNode = (
  nodes: ts.Node[],
  mainMethodName: string,
): ts.FunctionDeclaration | ts.ArrowFunction | null => {
  if (!mainMethodName) {
    out.warn('Got no main method name, returning null as main method node');
    return null;
  }
  let mainMethod: ts.FunctionDeclaration | ts.ArrowFunction | null = null;
  for (let i = 0, l = nodes.length; i < l && !mainMethod; i += 1) {
    const node = nodes[i];
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      const functionName = getFunctionName(node);
      if (functionName === mainMethodName) {
        mainMethod = node;
      }
    } else if (!ts.isJSDocCommentContainingNode(node)) {
      mainMethod = getMainMethodNode(node.getChildren(), mainMethodName);
    }
  }
  return mainMethod;
};

export default getMainMethodNode;
