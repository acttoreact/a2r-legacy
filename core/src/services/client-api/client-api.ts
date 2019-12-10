import ts from 'typescript';

export interface ImportItem {
  /**
   * Import path relative to client-api folder, will be turned to right production import path
   * @type {string}
   * @memberof ImportItem
   */
  importPath: string;
  /**
   * Optional alias for import clause. Also can be used as default alias when importing both
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

export interface ParamInfo {
  declarationNode: ts.ParameterDeclaration;
  identifier: ts.Identifier;
}

export interface ApiMethod {
  key: string;
  methodName: string;
}

export interface ApiNamespace {
  key: string;
  namespaces: ApiNamespace[];
  methods: ApiMethod[];
}
