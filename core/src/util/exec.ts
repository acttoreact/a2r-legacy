import { spawn } from 'child_process';

import { CommandResponse } from '../model';

/**
 * Executes command on terminal passing all received arguments
 * 
 * If you want to run something like `mkdir -m 777 mydir` you'll need to call this method like
 * `exec('mkdir', '-m', '777', 'mydir')`.
 * @param {string} command Command to execute (i.e. `mkdir`)
 * @param {...readonly string[]} args Arguments for command (i.e `-m` and `777`)
 * @returns {Promise<CommandResponse>} Command response
 */
const exec = (command: string, ...args: readonly string[]): Promise<CommandResponse> =>
  new Promise((resolve, reject): void => {
    const res: CommandResponse = {
      command,
      args: args.join(' '),
      code: 0,
      out: '',
      error: null,
    };

    const cmd = spawn(command, [...args]);

    cmd.stdout.on('data', (data): void => {
      res.out += data.toString();
    });

    cmd.on('error', (err): void => {
      res.error = err;
      reject(res);
    });
    cmd.on('close', (code): void => {
      res.code = code;
      resolve(res);
    });
  });

export default exec;
