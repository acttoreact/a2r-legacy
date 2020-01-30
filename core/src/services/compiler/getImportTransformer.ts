import ts from 'typescript';

export type ImportTransformer = (originalImport: string) => string;

const isInsideImportDeclaration = (node: ts.Node): boolean => {
  if (ts.isSourceFile(node)) {
    return false;
  }
  if (ts.isImportDeclaration(node.parent)) {
    return true;
  }
  return isInsideImportDeclaration(node.parent);
}

const visitNode = (
  node: ts.SourceFile | ts.Node,
  transformer: ImportTransformer,
): ts.SourceFile | ts.Node => {
  if (ts.isStringLiteral(node) && isInsideImportDeclaration(node)) {
    return ts.createStringLiteral(transformer(node.text));
  }
  return node;
};

const visitNodeAndChildren = (
  node: ts.SourceFile | ts.Node,
  context: ts.TransformationContext,
  transformer: ImportTransformer,
): ts.SourceFile | ts.Node => {
  return ts.visitEachChild(
    visitNode(node, transformer),
    (childNode) => visitNodeAndChildren(childNode, context, transformer),
    context,
  );
};

const getImportTransformer = (
  transformer: ImportTransformer,
): ts.TransformerFactory<ts.SourceFile> => (context: ts.TransformationContext) => (
  file: ts.SourceFile,
): ts.SourceFile => visitNodeAndChildren(file, context, transformer) as ts.SourceFile;

export default getImportTransformer;
