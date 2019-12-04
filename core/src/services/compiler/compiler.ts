import ts from 'typescript';

export enum ValidationErrorLevel {
  Error = 0,
  Warning = 1,
}

export interface JSDocContainer {
  jsDoc?: ts.JSDoc[];
}

export interface ReturnTypeInfo {
  /**
   * Return identifier
   * @type {string}
   * @memberof CompilerFileInfo
   */
  identifier: string;
  /**
   * Return type
   * @type {string}
   * @memberof CompilerFileInfo
   */
  type: string;
  /**
   * Return type
   * @type {string}
   * @memberof CompilerFileInfo
   */
  typeNode: ts.Node | null;
  /**
   * Returns a type reference instead of a primitive type
   * @type {boolean}
   * @memberof CompilerFileInfo
   */
  isTypeReference: boolean;
  /**
   * Type reference path
   * @type {string}
   * @memberof CompilerFileInfo
   */
  typeReferencePath?: string;
}

export interface ValidationError {
  /**
   * Error level
   * @type {ValidationErrorLevel}
   * @memberof ValidationError
   */
  level: ValidationErrorLevel;
  /**
   * Error message
   * @type {string}
   * @memberof ValidationError
   */
  message: string;
}

export interface CompilerFileInfo {
  mainMethodNode?: ts.FunctionDeclaration | ts.ArrowFunction | null;
  /**
   * Main method name
   * @type {string}
   * @memberof CompilerFileInfo
   */
  mainMethodName?: string;
  /**
   * Main method parameters nodes
   * @type {ts.ParameterDeclaration[]}
   * @memberof CompilerFileInfo
   */
  mainMethodParamNodes: ts.ParameterDeclaration[];
  /**
   * Main method JSDoc node
   * @type {JSDocContainer | null}
   * @memberof CompilerFileInfo
   */
  mainMethodDocs?: JSDocContainer | null;
  /**
   * Main method return type info
   * @type {ReturnTypeInfo}
   * @memberof CompilerFileInfo
   */
  mainMethodReturnTypeInfo?: ReturnTypeInfo | null;
  /**
   * Validation errors
   * @type {ValidationError[]}
   * @memberof CompilerFileInfo
   */
  validationErrors: ValidationError[];
}

export default {
  ValidationErrorLevel,
};
