import ts from 'typescript';

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (fileNamePath): string => fileNamePath,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: (): string => ts.sys.newLine,
};

export default formatHost;