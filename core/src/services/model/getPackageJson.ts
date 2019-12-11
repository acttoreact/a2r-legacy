import { ModelPackageJSON } from '../../model/model';
import getCurrentA2RPackageInfo from '../../tools/getCurrentA2RPackageInfo';

import settings from '../../config/settings';

const { modelPath } = settings;

const defaultPackage = {
  main: './dist/index.js',
  name: modelPath,
};

const getPackageJson = async (): Promise<ModelPackageJSON> => {
  const { version } = await getCurrentA2RPackageInfo();
  return {
    ...defaultPackage,
    version,
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };
};

export default getPackageJson;
