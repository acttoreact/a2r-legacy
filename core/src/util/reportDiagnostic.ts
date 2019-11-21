import ts from 'typescript';
import colors from 'colors';
import out from './out';

const reportDiagnostic = (
  diagnostic: ts.Diagnostic,
  formatHost: ts.FormatDiagnosticsHost,
): void => {
  out.error(
    `Error code ${colors.bgRed.white(
      diagnostic.code.toString(),
    )} compiling A2R Framework API File:\n${ts.formatDiagnosticsWithColorAndContext(
      [diagnostic],
      formatHost,
    )}`,
  );
};

export default reportDiagnostic;
