/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompilerFileInfo } from './compiler';

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