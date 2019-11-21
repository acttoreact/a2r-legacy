import path from 'path';
import util from 'util';

import fs from '../../util/fs';
import out from '../../util/out';
import { fullPath, fileName } from '../../util/terminalStyles';
import { addCommand, ConsoleCommand } from './consoleCommands';

interface CommandImportResult {
  default: ConsoleCommand;
}

const addCommandsFromPath = async (commandsFolder: string): Promise<void> => {
  const normalizedPath = path.normalize(commandsFolder);
  out.verbose(`Importing commands from ${fullPath(normalizedPath)}`);
  const exists = await fs.exists(normalizedPath);
  if (exists) {
    const commands = await fs.readDir(normalizedPath);
    await Promise.all(
      commands.reduce<Promise<void>[]>((t, commandFile): Promise<void>[] => {
        const extension = path.extname(commandFile);
        if (extension === '.js') {
          const promise = new Promise<void>((resolve, reject): void => {
            const commandPath = path.join(normalizedPath, commandFile);
            out.verbose(`Importing command from ${fullPath(commandPath)}`);
            import(commandPath)
              .then((command: CommandImportResult): void => {
                if (command.default) {
                  addCommand(command.default);
                } else {
                  out.error(
                    `Command from ${fullPath(
                      commandPath,
                    )} has wrong format: ${util.inspect(command)}`,
                  );
                }
                resolve();
              })
              .catch((ex): void => {
                out.error(
                  `Error adding terminal command: ${ex.message}\n${ex.stack}`,
                );
                reject(ex);
              });
          });
          t.push(promise);
        } else {
          out.verbose(`Skipping file ${fileName(commandFile)}`);
        }
        return t;
      }, new Array<Promise<void>>()),
    );
  } else {
    out.error(
      `Error adding commands from path, path ${fullPath(
        normalizedPath,
      )} doesn't exist`,
    );
  }
};

export default addCommandsFromPath;
