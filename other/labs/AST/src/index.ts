import fs from 'fs';
import ts from 'typescript';
import path from 'path';
import { promises } from 'dns';

const normalizedPath = path.resolve('./samples');

async function processFilesPath(path: string) {
  try {
    const fileNames = await fs.promises.readdir(path);
    const typeScriptFiles = fileNames.filter(name => name.endsWith('.ts'));
    await Promise.all(
      typeScriptFiles.map(async fileName => {
        const filePath = `${path}/${fileName}`;
        const sourceCode = await fs.promises.readFile(filePath, 'utf-8');
        const sourceFile = ts.createSourceFile(filePath, sourceCode, ts.ScriptTarget.Latest, true);
        console.log(sourceFile);
      })
    );

    console.log(typeScriptFiles);
  } catch (ex) {
    console.log(`Error process Files Path '${path}': ${ex}`);
  }
}

processFilesPath(normalizedPath).then(() => {
  console.log('OK')
});
