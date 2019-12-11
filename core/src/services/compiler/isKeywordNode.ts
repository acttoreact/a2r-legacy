import ts from 'typescript';

const keywordNodes = [
  ts.SyntaxKind.UndefinedKeyword,
  ts.SyntaxKind.VoidKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.NumberKeyword,
];

const isKeyWordNode = (node: ts.Node): boolean => keywordNodes.indexOf(node.kind) !== -1;

export default isKeyWordNode;
