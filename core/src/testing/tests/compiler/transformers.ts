import ts from 'typescript';
import path from 'path';

import fs from '../../../util/fs';
import formatHost from '../../../services/compiler/formatHost';
import reportDiagnostic from '../../../util/reportDiagnostic';
import getImportTransformer, { ImportTransformer } from '../../../services/compiler/getImportTransformer';

const emit = (program: ts.Program, transformers?: ts.CustomTransformers): void => {
  const emitResult = program.emit(undefined, undefined, undefined, undefined, transformers);
  const diagnostics = [
    ...ts.getPreEmitDiagnostics(program),
    ...emitResult.diagnostics,
    ...program.getSyntacticDiagnostics(),
  ];

  if (diagnostics && diagnostics.length) {
    diagnostics.forEach((diagnostic): void => {
      reportDiagnostic(diagnostic, formatHost);
    });
  }
};

describe('Framework Compiler', (): void => {
  test('Should transform framework imports to relative imports', async (): Promise<void> => {
    const fileName = 'frameworkImport';
    const rootDir = path.resolve(__dirname, '../../../../');
    const dataDir = path.resolve(__dirname, '../../data');
    const outDir = path.resolve(__dirname, '../../out');
    const filePath = path.resolve(dataDir, `${fileName}.ts`);
    const rootFile = path.relative(rootDir, filePath);
    console.log(filePath, rootDir, rootFile);
    const fileExists = await fs.exists(filePath);
    expect(fileExists).toBe(true);

    const program = ts.createProgram([rootFile], {
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      target: ts.ScriptTarget.ES2017,
      skipLibCheck: true,
      outDir,
      rootDir,
    });

    const importTransformer: ImportTransformer = (originalImport) =>
      originalImport.replace('colors', "transformed");

    const transformers: ts.CustomTransformers = {
      before: [getImportTransformer(importTransformer)],
    };

    emit(program, transformers);

    const outPath = path.resolve(outDir, rootFile.replace(/ts$/, 'js'));
    console.log(outPath);
    const outputExists = await fs.exists(outPath);
    expect(outputExists).toBe(true);

    const content = await fs.readFile(outPath, 'utf8');
    expect(content.indexOf(`'colors'`)).toBe(-1);
    expect(content.indexOf('transformed')).toBeGreaterThan(-1);
  });
});
