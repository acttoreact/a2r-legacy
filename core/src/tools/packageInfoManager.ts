import fs from '../util/fs';

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

interface PackageManager {
  loadPackage: () => Promise<PackageJSON>;
  savePackage: (newPackage: PackageJSON) => Promise<void>;
}

const packageManagerFunctions = (fullPackagePath: string): PackageManager => {
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
