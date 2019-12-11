import path from 'path';

import getProjectPath from './getProjectPath';
import { PackageManager, PackageJSON } from '../model';
import packageInfoManager from './packageInfoManager';

let manager: PackageManager | null = null;

const getManager = async (): Promise<PackageManager> => {
  if (!manager) {
    const projectPath = await getProjectPath();
    manager = packageInfoManager(path.join(projectPath, 'package.json'));
  }
  return manager;
};

export const updateCurrentProjectPackageInfo = async (newPackage: PackageJSON): Promise<void> => {
  const infoManager = await getManager();
  await infoManager.savePackage(newPackage);
};

const loadPackage = async (): Promise<PackageJSON> => {
  const infoManager = await getManager();
  return infoManager.loadPackage();
};

export default loadPackage;
