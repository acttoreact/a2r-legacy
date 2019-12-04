/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompilerFileInfo } from '../compiler';

export const apiPathKey = '_apiPath';

export interface APIModule {
  /**
   * Module default export. Must be a `function` and return a `Promise`. Should contain a method to
   * be called from client
   * @memberof APIModule
   */
  default: (...args: any[]) => Promise<any>;
  /**
   * Module dispose method. Optional. Will be called when a module is disposed or updated.
   * @memberof APIModule
   */
  dispose?: () => Promise<void>;
  /**
   * Information extracted from file during compilation
   * @type {CompilerFileInfo}
   * @memberof APIModule
   */
  compilerInfo: CompilerFileInfo;
  /**
   * Module relative path from main api folder
   * @type {string}
   * @memberof APIModule
   */
  relativePath: string;
}

export interface APIStructure {
  [id: string]: APIModule;
}

export interface PathToModuleDictionary {
  [id: string]: string;
}

export interface PathToSubModuleDictionary {
  [id: string]: string[];
}

export const pathToModuleDictionary: PathToModuleDictionary = {};
export const moduleToPathDictionary: PathToModuleDictionary = {};
export const pathToSubModuleDictionary: PathToSubModuleDictionary = {};

const api: APIStructure = {};

export default api;
