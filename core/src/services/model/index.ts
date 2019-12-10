import ts from 'typescript';

import getProjectPath from '../../tools/getProjectPath';
import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from '../compiler/compileOptions';
import formatHost from '../compiler/formatHost';

const compileFile = async (
  rootFile: string,
  outDir: string,
  rootDir?: string,
): Promise<void> => {
  const program = ts.createProgram([rootFile], {
    ...compileOptions,
    outDir,
    rootDir: rootDir || (await getProjectPath()),
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
