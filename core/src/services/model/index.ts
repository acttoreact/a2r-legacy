import path from 'path';
import addCommandsFromPath from '../commands/addCommandsFromPath';
import model from './model';

export const setupModel = async (): Promise<void> => {
  const commandsPath = path.resolve(__dirname, 'commands');
  await addCommandsFromPath(commandsPath);
};

export default model;
