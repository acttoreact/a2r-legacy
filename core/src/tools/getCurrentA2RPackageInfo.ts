import path from 'path';

import getFrameworkPath from './getFrameworkPath';
import { PackageManager, PackageJSON } from '../model';
import packageInfoManager from './packageInfoManager';

let manager: PackageManager | null = null;

const getManager = async (): Promise<PackageManager> => {
  if (!manager) {
    const frameworkPath = await getFrameworkPath();
    manager = packageInfoManager(path.join(frameworkPath, 'package.json'));
  }
  return manager;
};

export const updateCurrentA2RPackageInfo = async (newPackage: PackageJSON): Promise<void> => {
  const infoManager = await getManager();
  await infoManager.savePackage(newPackage);
};

const loadPackage = async (): Promise<PackageJSON> => {
  const infoManager = await getManager();
  return infoManager.loadPackage();
};

export default loadPackage;
