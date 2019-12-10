import fs from '../../util/fs';
import out from '../../util/out';
// import model from './model';

const build = async (filePath: string): Promise<void> => {
  // import everything into content

  const content = '';

  await fs.writeFile(filePath, content);
  out.verbose('Client API Built!');
};

export default build;
