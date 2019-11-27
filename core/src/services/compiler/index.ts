import ts from 'typescript';

import validate from './validate';
import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from './compileOptions';
import formatHost from './formatHost';

const compileFile = async (rootFile: string, rootDir: string, outDir: string): Promise<void> => {
  await validate(rootFile);

  const program = ts.createProgram([rootFile], {
    ...compileOptions,
    rootDir,
    outDir,
  });

  const emitResult = program.emit();
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

export default compileFile;
