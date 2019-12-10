import ts from 'typescript';

/**
 * Compiler validation error level
 */
export enum ValidationErrorLevel {
  /**
   * File won't be processed because of this error
   */
  Error = 0,
  /**
   * File will be processed regardless of this error
   */
  Warning = 1,
}

/**
 * For typescript nodes casting as docs container purposes
 */
export interface JSDocContainer {
  /**
   * Optional JSDoc array
   * @type {ts.JSDoc[]}
   * @memberof JSDocContainer
   */
  jsDoc?: ts.JSDoc[];
}

/**
 * Information regarding the return type of a function extracted using AST
 */
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

/**
 * Validation error while or after extracting info
 */
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

/**
 * Compiler AST extracted info
 */
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
