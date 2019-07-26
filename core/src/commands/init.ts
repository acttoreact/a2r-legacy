import colors from 'colors';
import path from 'path';
import fs from 'fs';
import out from '../util/out';

export default async (): Promise<void> => {
  out.info(
    colors.yellow.bold(`>>> Initializing project for ${colors.yellow.magenta('A2R')} Framework`)
  );
  out.verbose(`Current path is ${__dirname}`);

  const modePath = path.join(__dirname, '../../model');
  const targetPath = path.join(__dirname, '../../../..');
  out.verbose(`Model path is ${modePath}`);
  out.verbose(`Target path is ${targetPath}`);
  const contents = await fs.promises.readdir(modePath);
  await Promise.all(
    contents.map(
      async (content: string): Promise<void> => {
        out.info(colors.green(`Generating file ${colors.yellow.bold.cyan(content)}.`));
        await fs.promises.copyFile(`${modePath}/${content}`, `${targetPath}/${content}`);
      }
    )
  );
};
