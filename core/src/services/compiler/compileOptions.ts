import ts from 'typescript';

const compileOptions: ts.CompilerOptions = {
  declaration: true,
  esModuleInterop: true,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  skipLibCheck: true,
  sourceMap: true,
  strict: true,
  target: ts.ScriptTarget.ES2017,
};

export default compileOptions;
