import ts from 'typescript';
import fs from '../../util/fs';
import out from '../../util/out';

interface JSDocContainer {
  jsDoc?: ts.JSDoc[];
  jsDocCache?: ts.JSDocTag[];
}

async function processFiles(pathToProcess: string): Promise<void> {
  function visit(
    node: ts.Node,
    fullNamespace: string[] = new Array<string>(),
    defaultNamespace: string[] = new Array<string>()
  ): void {
    if (ts.isModuleDeclaration(node)) {
      const newNamespace = [...fullNamespace, node.name.getText()];
      node.forEachChild((subNode): void => visit(subNode, newNamespace));
    } else if (ts.isFunctionDeclaration(node)) {
      const functionNode: ts.FunctionDeclaration = node as ts.FunctionDeclaration;
      const jsdocNode: JSDocContainer = node as JSDocContainer;

      let functionNamespace: string;

      if (fullNamespace.length > 0) {
        functionNamespace = fullNamespace.join('.');
      } else if (defaultNamespace.length > 0) {
        functionNamespace = defaultNamespace.join('.');
      } else {
        functionNamespace = '.';
      }

      out.info(
        `**Function ${functionNamespace}.${
          functionNode.name ? functionNode.name.getText() : 'Unnamed function'
        } that returns type ${functionNode.type ? functionNode.type.getText() : ''}:`
      );

      if (jsdocNode && jsdocNode.jsDoc && jsdocNode.jsDoc.length === 1) {
        out.info(`   ${jsdocNode.jsDoc[0].getText()}`);
      } else {
        out.info('Undocumented!');
      }

      node.parameters.forEach(
        (param): void => {
          out.info(
            `\t\tParam named ${param.name.getText()} of type ${
              param.type ? param.type.getText() : ''
            }`
          );
        }
      );
    } else {
      node.forEachChild((subNode): void => visit(subNode, fullNamespace));
    }
  }

  try {
    const fileNames = await fs.readDir(pathToProcess);
    const typeScriptFiles = fileNames.filter((name): boolean => name.endsWith('.ts'));
    await Promise.all(
      typeScriptFiles.map(
        async (fileName): Promise<void> => {
          const filePath = `${pathToProcess}/${fileName}`;
          const sourceCode = await fs.readFile(filePath, 'utf-8');
          const sourceFile = ts.createSourceFile(
            filePath,
            sourceCode,
            ts.ScriptTarget.Latest,
            true
          );
          visit(sourceFile);
        }
      )
    );
  } catch (ex) {
    out.info(`Error process Files Path '${pathToProcess}': ${ex}`);
  }
}

export default processFiles;
