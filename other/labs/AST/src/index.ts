import fs from 'fs';
import ts from 'typescript';
import path from 'path';

const normalizedPath = path.resolve('./samples');

export interface IJSDocContainer {
  jsDoc?: ts.JSDoc[];                      // JSDoc that directly precedes this node
  jsDocCache?: ReadonlyArray<ts.JSDocTag>; // Cache for getJSDocTags
}

const files_to_process = 2;

async function processFilesPath(path: string) {
  function visit(node: ts.Node, fullNamespace: string[] = new Array<string>()) {
    if (ts.isModuleDeclaration(node)) {
      const newNamespace = [...fullNamespace, node.name.getText()];
      node.forEachChild(node => visit(node, newNamespace));
    } else if (ts.isFunctionDeclaration(node)) {
      const functionNode: ts.FunctionDeclaration = <ts.FunctionDeclaration>node;
      const jsdocNode: IJSDocContainer = <IJSDocContainer>node;

      console.log(`**Function ${fullNamespace.join('.')}.${functionNode.name ? functionNode.name.getText() : 'Unnamed function'} that returns type ${functionNode.type ? functionNode.type.getText() : ''}:`);

      if (jsdocNode && jsdocNode.jsDoc && jsdocNode.jsDoc.length == 1) {
        console.log('   ' + jsdocNode.jsDoc[0].getText());
      } else {
        console.log('Undocumented!');
      }


      for (const param of node.parameters) {
        console.log(`\t\tParam named ${param.name.getText()} of type ${param.type ? param.type.getText() : ''}`);
      }
    } else {
      node.forEachChild(node => visit(node, fullNamespace));
    }
  }

  try {
    const fileNames = await fs.promises.readdir(path);
    const typeScriptFiles = fileNames.filter(name => name.endsWith('.ts'));
    await Promise.all(
      typeScriptFiles.map(async fileName => {
        const filePath = `${path}/${fileName}`;
        const sourceCode = await fs.promises.readFile(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
        visit(sourceFile);
      })
    );
  } catch (ex) {
    console.log(`Error process Files Path '${path}': ${ex}`);
  }
}

processFilesPath(normalizedPath).then(() => {
  console.log('OK');
});
