import ts from 'typescript';

import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from './compileOptions';
import formatHost from './formatHost';

const compileFile = (rootFile: string, rootDir: string, outDir: string): void => {
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
