import ts from 'typescript';

export interface JSDocContainer {
  jsDoc?: ts.JSDoc[];
  jsDocCache?: ts.JSDocTag[];
};
