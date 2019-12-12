import ts from 'typescript';

import { JSDocContainer } from '../../model/compiler';

const getFunctionDocContainer = (node: ts.FunctionDeclaration | ts.ArrowFunction): JSDocContainer | null => {
  if (ts.isFunctionDeclaration(node)) {
    return node as JSDocContainer;
  } 
  if (ts.isArrowFunction(node)) {
    let statement = node.parent;
    while (statement && !ts.isVariableStatement(statement)) {
      statement = statement.parent;
    }
    return statement as JSDocContainer;
  }
  return null;
};

export default getFunctionDocContainer;
