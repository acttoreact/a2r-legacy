import path from 'path';

import fs from '../../util/fs';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';
import { addCommand } from './consoleCommands';

const addCommandsFromPath = async (commandsFolder: string): Promise<void> => {
  const normalizedPath = path.normalize(commandsFolder);
  const exists = await fs.exists(normalizedPath);
  if (exists) {
    const commands = await fs.readDir(normalizedPath);
    Promise.all(
      commands.map(
        (commandFile): Promise<void> =>
          new Promise((resolve, reject): void => {
            const commandPath = path.join(normalizedPath, commandFile);
            import(commandPath)
              .then((command): void => {
                addCommand(command.default);
                resolve();
              })
              .catch((ex): void => {
                out.error(`Error adding terminal command: ${ex.message}\n${ex.stack}`);
                reject(ex);
              });
          }),
      ),
    );
  } else {
    out.error(`Error adding commands from path, path ${fullPath(normalizedPath)} doesn't exist`);
  }
};

export default addCommandsFromPath;
