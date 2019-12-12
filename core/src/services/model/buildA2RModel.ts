import path from 'path';

import fs from '../../util/fs';

import settings from '../../config/settings';

const { modelPath, sharedModelFiles, sharedModelFileName } = settings;

const buildA2RModel = async (frameworkPath: string, modelFrameworkPath: string): Promise<void> => {
  const contents = sharedModelFiles.map((fileName) => {
    const importName = path.basename(fileName, path.extname(fileName));
    const filePath = path.resolve(frameworkPath, 'dist', modelPath, importName);
    const importPath = path.relative(modelFrameworkPath, filePath);
    return `export * from '${importPath}';`;
  });

  const filePath = path.resolve(modelFrameworkPath, `${sharedModelFileName}.ts`);
  await fs.writeFile(filePath, contents.join('\n'));
};

export default buildA2RModel;