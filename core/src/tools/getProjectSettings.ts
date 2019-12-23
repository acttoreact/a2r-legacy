import path from 'path';

import { A2RSettings } from '../model/settings';
import getProjectPath from './getProjectPath';

const getProjectSettings = async (): Promise<A2RSettings> =>
  new Promise((resolve, reject) => {
    getProjectPath().then((projectPath) => {
      const settingsPath = path.resolve(projectPath, 'config', 'settings');
      import(settingsPath)
        .then((settings: A2RSettings) => {
          resolve(settings);
        })
        .catch(reject);
    });
  });

export default getProjectSettings;
