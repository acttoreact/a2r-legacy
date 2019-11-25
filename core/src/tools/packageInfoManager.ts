import fs from '../util/fs';
import out from '../util/out';
import { fullPath } from '../util/terminalStyles';

export interface PackageJSON extends Object {
  name: string;
  version: string;
  dependencies: DependencyMap;
  devDependencies: DependencyMap;
  scripts: ScriptsMap;
}

export interface DependencyMap {
  [dependencyName: string]: string;
}

export interface ScriptsMap {
  [scriptName: string]: string;
}

export interface PackageManager {
  loadPackage: () => Promise<PackageJSON>;
  savePackage: (newPackage: PackageJSON) => Promise<void>;
}

const packageManagerFunctions = (fullPackagePath: string): PackageManager => {
  out.verbose(`Getting package info for package ${fullPath(fullPackagePath)}`);
  return {
    loadPackage: async (): Promise<PackageJSON> => {
      const packageJsonA2RText: string = await fs.readFile(fullPackagePath, {
        encoding: 'utf-8',
      });
      const parsedA2RPackage = JSON.parse(packageJsonA2RText) as PackageJSON;
      return parsedA2RPackage;
    },
    savePackage: async (newPackage: PackageJSON): Promise<void> => {
      await fs.writeFile(
        fullPackagePath,
        JSON.stringify(newPackage, null, 2),
        {
          encoding: 'utf-8',
        }
      );
    },
  };
};

export default packageManagerFunctions;
