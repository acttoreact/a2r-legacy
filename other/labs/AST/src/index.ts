/* eslint no-console: "off" */
import fs from 'fs';
import ts from 'typescript';
import path from 'path';

const normalizedPath = path.resolve('./samples');


interface IJSDocContainer {
  jsDoc?: ts.JSDoc[];
  jsDocCache?: ts.JSDocTag[];
}

async function processFilesPath(pathToProcess: string): Promise<void> {  

  console.log('hello' + pathToProcess + '');
  function visit(node: ts.Node, fullNamespace: string[] = new Array<string>()): void {
    if (ts.isModuleDeclaration(node)) {
      const newNamespace = [...fullNamespace, node.name.getText()];
      node.forEachChild((subNode): void => visit(subNode, newNamespace));
    } else if (ts.isFunctionDeclaration(node)) {
      const functionNode: ts.FunctionDeclaration = node as ts.FunctionDeclaration;
      const jsdocNode: IJSDocContainer = node as IJSDocContainer;

      console.log(`**Function ${fullNamespace.join('.')}.${functionNode.name ? functionNode.name.getText() : 'Unnamed function'} that returns type ${functionNode.type ? functionNode.type.getText() : ''}:`);

      if (jsdocNode && jsdocNode.jsDoc && jsdocNode.jsDoc.length === 1) {
        console.log(`   ${jsdocNode.jsDoc[0].getText()}`);
      } else {
        console.log('Undocumented!');
      }

      node.parameters.forEach((param): void => {
        console.log(`\t\tParam named ${param.name.getText()} of type ${param.type ? param.type.getText() : ''}`);
      });

    } else {
      node.forEachChild((subNode): void => visit(subNode, fullNamespace));
    }
  }

  try {
    const fileNames = await fs.promises.readdir(pathToProcess);
    const typeScriptFiles = fileNames.filter((name): boolean => name.endsWith('.ts'));
    await Promise.all(
      typeScriptFiles.map(async (fileName): Promise<void> => {
        const filePath = `${pathToProcess}/${fileName}`;
        const sourceCode = await fs.promises.readFile(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
        visit(sourceFile);
      })
    );
  } catch (ex) {
    console.log(`Error process Files Path '${pathToProcess}': ${ex}`);
  }
}

processFilesPath(normalizedPath).then((): void => {
  console.log('OK');
});
