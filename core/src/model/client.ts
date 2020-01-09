/* eslint-disable @typescript-eslint/no-explicit-any */
import ts from 'typescript';

/**
 * Item to import on Client API main file
 */
export interface ImportItem {
  /**
   * Import path relative to `services/client` folder, will be turned to right production import
   * path
   * @type {string}
   * @memberof ImportItem
   */
  importPath: string;
  /**
   * Optional alias for import clause. Can also be used as default alias when importing both
   * default and named imports from same path
   * @type {string}
   * @memberof ImportItem
   */
  alias?: string;
  /**
   * Optional named imports to import from path
   * @type {string[]}
   * @memberof ImportItem
   */
  namedImports?: string[];
}

/**
 * Function parameter info
 */
export interface ParamInfo {
  /**
   * Parameter declaration original node
   * @type {ts.ParameterDeclaration}
   * @memberof ParamInfo
   */
  declarationNode: ts.ParameterDeclaration;
  /**
   * Parameter identifier original node
   * @type {ts.Identifier}
   * @memberof ParamInfo
   */
  identifier: ts.Identifier;
}

/**
 * API Method in Client API structure
 */
export interface ApiMethod {
  /**
   * Property key
   * @type {string}
   * @memberof ApiMethod
   */
  key: string;
  /**
   * Method name
   * @type {string}
   * @memberof ApiMethod
   */
  methodName: string;
}

/**
 * API Namespace in Client API structure
 */
export interface ApiNamespace {
  /**
   * Property key
   * @type {string}
   * @memberof ApiNamespace
   */
  key: string;
  /**
   * Namespaces for property (object sub-objects)
   * @type {ApiNamespace[]}
   * @memberof ApiNamespace
   */
  namespaces: ApiNamespace[];
  /**
   * Methods for property (object methods)
   * @type {ApiMethod[]}
   * @memberof ApiNamespace
   */
  methods: ApiMethod[];
}
