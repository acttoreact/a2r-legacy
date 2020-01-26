import ts from 'typescript';
import path from 'path';

import fs from '../../util/fs';

import settings from '../../config/settings';

const { socketPath } = settings;

const buildSocketProvider = async (clientApiPath: string, port: number): Promise<void> => {
  const filePath = path.resolve(clientApiPath, 'socket.ts');
  const url = `http://localhost:${port}`;
  const sourceFile = ts.createSourceFile(
    filePath,
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const importNode = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(ts.createIdentifier('io'), undefined),
    ts.createStringLiteral('socket.io-client'),
  );
  const socketNode = ts.createVariableStatement(
    undefined,
    ts.createVariableDeclarationList(
      [
        ts.createVariableDeclaration(
          ts.createIdentifier('socket'),
          undefined,
          ts.createCall(
            ts.createIdentifier('io'),
            undefined,
            [
              ts.createStringLiteral(
                url,
              ),
              ts.createObjectLiteral(
                [
                  ts.createPropertyAssignment(
                    ts.createIdentifier('autoConnect'),
                    ts.createPrefix(
                      ts.SyntaxKind.ExclamationToken,
                      ts.createPrefix(
                        ts.SyntaxKind.ExclamationToken,
                        ts.createPropertyAccess(
                          ts.createIdentifier("process"),
                          ts.createIdentifier("browser"),
                        ),
                      ),
                    ),
                  ),
                  ts.createPropertyAssignment(
                    ts.createIdentifier('path'),
                    ts.createStringLiteral(socketPath),
                  ),
                ],
                true,
              ),
            ],
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );
  const exportNode = ts.createExportAssignment(
    undefined,
    undefined,
    undefined,
    ts.createIdentifier('socket'),
  );
  const content = [
    printer.printNode(ts.EmitHint.Unspecified, importNode, sourceFile),
    printer.printNode(ts.EmitHint.Unspecified, socketNode, sourceFile),
    `${printer.printNode(ts.EmitHint.Unspecified, exportNode, sourceFile)}\n`,
  ].join('\n\n');
  await fs.writeFile(filePath, content);
};

export default buildSocketProvider;
