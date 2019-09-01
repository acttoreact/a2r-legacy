/* eslint-disable @typescript-eslint/no-explicit-any */
export const apiPathKey = '_apiPath';

export interface APIModule {
  /**
   * Module default export. Must be a `function` and return a `Promise`. Should contain a method to
   * be called from client
   */
  default: (...args: any[]) => Promise<any>;

  /**
   * Module dispose method. Optional. Will be called when a module is disposed or updated.
   */
  dispose?: () => Promise<void>;
}

export interface APIStructure {
  [id: string]: APIModule | APIStructure;
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
