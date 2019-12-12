import path from 'path';

import fs from '../../util/fs';

const internalImports = [
  './a2r'
]

const getImports = async (
  mainPath: string,
  fromPath?: string,
  recursive = true,
): Promise<string[]> => {
  const res = [...internalImports];
  const contents = await fs.readDir(mainPath, { withFileTypes: true });
  const subFolders = [];
  for (let i = 0, l = contents.length; i < l; i += 1) {
    const content = contents[i];
    const contentFullPath = path.resolve(mainPath, content.name);
    if (content.isDirectory()) {
      if (recursive) {
        subFolders.push(contentFullPath);
      }
    } else if (fromPath) {
      res.push(`.${path.sep}${path.relative(fromPath, contentFullPath).replace(/\.ts$/, '')}`);
    } else {
      res.push(`.${path.sep}${contentFullPath.replace(/\.ts$/, '')}`);
    }
  }
  const subImports = await Promise.all(
    subFolders.map((f): Promise<string[]> => getImports(f, fromPath, recursive)),
  );
  for (let i = 0, l = subImports.length; i < l; i += 1) {
    res.push(...subImports[i]);
  }
  return res;
};

export default getImports;
