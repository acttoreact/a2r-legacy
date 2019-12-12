import ts from 'typescript';
import colors from 'colors';

import fs from '../../util/fs';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';
import model from './model';

const getIdentifier = (nodes: ts.Node[]): string => {
  let res = '';
  for (let i = 0, l = nodes.length; i < l && !res; i += 1) {
    const node = nodes[i];
    if (ts.isIdentifier(node)) {
      res = node.getText().trim();
    }
  }
  return res;
};

const getExportsIdentifiersFromNodes = (
  nodes: ts.Node[],
  keys: string[] = new Array<string>(),
): string[] => {
  const res = [...keys];
  for (let i = 0, l = nodes.length; i < l; i += 1) {
    const node = nodes[i];
    const children = node.getChildren();
    if (
      ts.isInterfaceDeclaration(node) ||
      ts.isEnumDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)
    ) {
      const identifier = getIdentifier(children);
      if (!identifier) {
        throw Error(`Couldn't find identifier for export declaration:\n${node.getText()}`);
      }
      res.push(identifier);
    } else if (children.length) {
      res.push(...getExportsIdentifiersFromNodes(children));
    }
  }
  return res;
};

const getExportsIdentifiers = async (filePath: string): Promise<string[]> => {
  out.verbose(`Getting module info from ${fullPath(filePath)}`);
  const content = await fs.readFile(filePath, 'utf8');
  const keys = new Array<string>();
  if (content) {
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
    const fileNodes = sourceFile.getChildren();
    const identifiers = getExportsIdentifiersFromNodes(fileNodes);
    for (let i = 0, l = identifiers.length; i < l; i += 1) {
      const identifier = identifiers[i];
      const keyPath = model.get(identifier);
      if (keyPath && keyPath !== filePath) {
        throw Error(
          `There is already a type, interface or enum called ${colors.bold(
            identifier,
          )} on file ${fullPath(keyPath)}`,
        );
      }
      keys.push(...identifiers);
    }
  }
  return keys;
};

export default getExportsIdentifiers;
