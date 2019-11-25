#!/usr/bin/env node
import colors from 'colors';
import args from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import getPort from 'get-port';
import readline from 'readline';

import createServer from '../../server';
import rules from './paramsRules';
import { getCommandFunction } from './consoleCommands';
import setup from './setup';
import init from './init';
import commandLineInfo from './commandLineInfo';
import out from '../../util/out';
import update from '../../tools/update';
import patch from '../../tools/patch';
import getVersion from '../../tools/getVersion';
import write from '../../util/write';
import { framework } from '../../util/terminalStyles';

import settings from '../../config/settings';

const { defaultDevLogLevel, defaultLogLevel, defaultPort } = settings;

const options = args(rules);

if (options.frameworkLogLevel) {
  out.setLevel(options.frameworkLogLevel);
} else {
  out.setLevel(options.dev ? defaultDevLogLevel : defaultLogLevel);
}

if (options.help) {
  write(`${commandLineUsage(commandLineInfo)}\n\n`);
} else {
  const initFramework = async (): Promise<void> => {
    if (options.port < 100) {
      out.error(
        `${colors.red.bold(
          '--port',
        )}: port < 100 is forbidden and it is set to ${colors.cyan.bold(
          options.port.toString(),
        )} the port will be set to the default value ${colors.cyan.green(
          defaultPort.toString(),
        )}`,
      );
      options.port = defaultPort;
    } else if (options.port < 8000) {
      out.warn(
        `${colors.red.bold(
          '--port',
        )}: port < 8000 which is dangerous and it is set to ${colors.cyan.bold(
          options.port.toString(),
        )}`,
      );
    } else if (Number.isNaN(options.port)) {
      out.error(
        `${colors.red.bold(
          '--port',
        )}: port must be a number and it is set to ${colors.cyan.bold(
          defaultPort.toString(),
        )}`,
      );
      options.port = defaultPort;
    }

    const port = await getPort({ port: options.port || defaultPort });

    if (port !== options.port) {
      out.warn(
        `The port ${colors.red.bold(
          options.port,
        )} was in use so the framework will use ${colors.cyan.bold(
          port.toString(),
        )}`,
      );
    }

    if (options.init) {
      init()
        .then((): void => {
          out.info(
            colors.yellow.bold(`<<< 👌 Project initialized successfully`),
          );
        })
        .catch((err: Error): void => {
          out.error(err.message, { stack: err.stack });
        });
    } else if (options.update) {
      update()
        .then((): void => {
          out.info(colors.yellow.bold(`<<< 👌 Project updated successfully`));
        })
        .catch((err: Error): void => {
          out.error(err.message, { stack: err.stack });
        });
    } else if (options.patch) {
      patch()
        .then((): void => {
          out.info(colors.yellow.bold(`<<< 👌 Project patched successfully`));
        })
        .catch((err: Error): void => {
          out.error(err.message, { stack: err.stack });
        });
    } else if (options.version) {
      getVersion()
        .then((): void => {})
        .catch((err: Error): void => {
          out.error(err.message, { stack: err.stack });
        });
    } else if (options.frameworkLogLevel) {
      
    } else {
      out.info(
        `${colors.bgBlue.bold(
          `>>> Starting ${framework} on port ${colors.yellow.bold(
            port.toString(),
          )}`,
        )} 🚀`,
      );

      await createServer(options.dev, port).then(
        async (value): Promise<void> => {
          if (options.dev) {
            const rl = readline.createInterface(
              process.stdin,
              process.stdout,
            );

            await setup(rl, value);
            rl.on(
              'line',
              async (cmd: string): Promise<void> => {
                const params = cmd.trim().split(' ');
                let command = params[0];
                if (command) {
                  if (command === 'quit') {
                    command = 'exit';
                  }
                  const onExecute = getCommandFunction(command);
                  if (onExecute) {
                    try {
                      const [, ...rest] = params;
                      await onExecute(write, ...rest);
                    } catch (err) {
                      out.error(err.message, { stack: err.stack });
                    }
                    write('\n');
                  } else {
                    write(
                      `Unknown command: ${colors.red(
                        command,
                      )}.\nUse ${colors.green(
                        'help',
                      )} for the command list.\n`,
                    );
                  }
                }
              },
            );
          }
        },
      );
    }
  };

  initFramework()
    .then((): void => {
      out.verbose(colors.yellow.bold('Framework initialized'));
    })
    .catch((err: Error): void => {
      out.error(err.message, { stack: err.stack });
    });
}
