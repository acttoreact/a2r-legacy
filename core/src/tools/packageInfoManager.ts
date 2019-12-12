import { PackageManager, PackageJSON } from '../model';
import fs from '../util/fs';
import out from '../util/out';
import { fullPath } from '../util/terminalStyles';

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
