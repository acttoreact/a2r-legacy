import ts from 'typescript';

export interface JSDocContainer {
  jsDoc?: ts.JSDoc[];
  jsDocCache?: ts.JSDocTag[];
}

export interface CompilerFileInfo {
  mainMethodName: string;
  mainMethodReturnType: string;
  mainMethodDocs: string;
  mainMethodReturnsTypeReference: boolean;
  referenceTypePath?: string;
}
