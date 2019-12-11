import ts from 'typescript';

import getProjectPath from '../../tools/getProjectPath';
import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from './compileOptions';
import formatHost from './formatHost';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';

const compileFile = async (rootFile: string, outDir: string, rootDir?: string): Promise<void> => {
  const theRootDir = rootDir || (await getProjectPath());
  out.verbose(
    `Compiling rootFile ${fullPath(rootFile)} from rootDir ${fullPath(
      theRootDir,
    )} to outDir ${fullPath(outDir)}`,
  );
  const program = ts.createProgram([rootFile], {
    ...compileOptions,
    outDir,
    rootDir: theRootDir,
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

export * from '../../model/compiler';
export default compileFile;
