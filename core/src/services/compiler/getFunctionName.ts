import ts from 'typescript';
import colors from 'colors';

const getArrowFunctionName = (node: ts.FunctionDeclaration | ts.ArrowFunction): string => {
  if (ts.isArrowFunction(node)) {
    const { parent } = node;
    if (parent && ts.isVariableDeclaration(parent) && parent.name) {
      return parent.name.getText();
    }
  } else if (ts.isFunctionDeclaration(node) && node.name) {
    return node.name.getText();
  }
  return colors.italic('Anonymous function');
};

export default getArrowFunctionName;
