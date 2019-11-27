import ts from 'typescript';
import colors from 'colors';

import getFunctionName from './getFunctionName';
import getFunctionDocContainer from './getFunctionDocContainer';
import fs from '../../util/fs';
import { method as methodOnLogs } from '../../util/terminalStyles';

const getMainFunctionName = (nodes: ts.Node[]): string => {
  let name = '';
  for (let i = 0, l = nodes.length; i < l && !name; i += 1) {
    const node = nodes[i];
    if (ts.isExportAssignment(node)) {
      const exportAssignment = node as ts.ExportAssignment;
      const isDefaultExport = exportAssignment.getText().trim().indexOf('export default') === 0;
      if (isDefaultExport) {
        name = exportAssignment.expression.getText().trim();
      }
    } else {
      name = getMainFunctionName(node.getChildren());
    }
  }
  return name;
};

const validateNode = (node: ts.Node, mainFunctionName: string): void => {
  if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
    const functionName = getFunctionName(node);
    const docContainer = getFunctionDocContainer(node);
    if (functionName === mainFunctionName) {
      const isDocumented = docContainer && docContainer.jsDoc && docContainer.jsDoc.length;
      if (!isDocumented) {
        throw Error(
          `method ${methodOnLogs(functionName)} ${colors.bold(
            'must',
          )} be documented`,
        );
      }
    }
  } else {
    node.forEachChild((subNode): void => validateNode(subNode, mainFunctionName));
  }
};

const validate = async (filePath: string): Promise<void> => {
  const content = await fs.readFile(filePath, 'utf8');
  if (content) {
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
    );
    const mainFunctionName = getMainFunctionName(sourceFile.getChildren());
    sourceFile.forEachChild((subNode): void =>
      validateNode(subNode, mainFunctionName),
    );
  }
};

export default validate;
