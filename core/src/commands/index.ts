#!/usr/bin/env node
import colors from 'colors';
import args from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import getPort from 'get-port';
import readline from 'readline';
import out from '../util/out';
import rules from './paramsRules';
import commandLineInfo from './commandLineInfo';
import setting from '../config/settings';
import server from '../server';
import init from './init';
import update from './update';
import patch from './patch';
import { getCommandFunction } from './consoleCommands';
import setupBasicConsoleCommands from './setupBasicConsoleCommands';

const options = args(rules);

out.setLevel(options.frameworkLogLevel);

const valid = !options.help;

if (options.help) {
  // eslint-disable-next-line no-console
  console.log(commandLineUsage(commandLineInfo));
} else {
  const initFramework = async (): Promise<void> => {
    if (options.port < 1000) {
      out.error(
        `${colors.red.bold(
          '--port'
        )}: port < 100 is forbidden and it is set to ${colors.cyan.bold(
          options.port.toString()
        )} the port will be set to the default value ${colors.cyan.green(
          setting.defaultPort.toString()
        )}`
      );
      options.port = setting.defaultPort;
    } else if (options.port < 8000) {
      out.warn(
        `${colors.red.bold(
          '--port'
        )}: port < 8000 which is dangerous and it is set to ${colors.cyan.bold(
          options.port.toString()
        )}`
      );
    } else if (Number.isNaN(options.port)) {
      out.error(
        `${colors.red.bold(
          '--port'
        )}: port must be a number and it is set to ${colors.cyan.bold(
          setting.defaultPort.toString()
        )}`
      );
      options.port = setting.defaultPort;
    }

    const port = await getPort({ port: options.port });

    if (port !== options.port) {
      out.warn(
        `The port ${colors.red.bold(
          options.port
        )} was in use so the framework will use ${colors.cyan.bold(
          port.toString()
        )}`
      );
    }

    if (valid) {
      if (options.init) {
        init()
          .then(
            (): void => {
              out.info(
                colors.yellow.bold(`<<< Project initialized successfully`)
              );
            }
          )
          .catch(
            (err: Error): void => {
              out.error(err.message, { stack: err.stack });
            }
          );
      } else if (options.update) {
        update()
          .then(
            (): void => {
              out.info(
                colors.yellow.bold(`<<< Project updated successfully`)
              );
            }
          )
          .catch(
            (err: Error): void => {
              out.error(err.message, { stack: err.stack });
            }
          );
      } else if (options.patch) {
        patch()
          .then(
            (): void => {
              out.info(
                colors.yellow.bold(`<<< Project patched successfully`)
              );
            }
          )
          .catch(
            (err: Error): void => {
              out.error(err.message, { stack: err.stack });
            }
          );
      } else {
        out.info(
          colors.bgBlue.bold(
            `>>> Starting ${colors.magenta(
              'A2R'
            )} Framework on port ${colors.yellow.bold(port.toString())}`
          )
        );
        server(options.dev, port).then(
          (value): void => {
            if (options.dev) {
              const rl = readline.createInterface(
                process.stdin,
                process.stdout
              );

              setupBasicConsoleCommands(rl, value);

              rl.on(
                'line',
                (cmd: string): void => {
                  const params = cmd.trim().split(' ');
                  let command = params[0];
                  if (command === 'quit') command = 'exit';

                  const onExecute = getCommandFunction(command);

                  if (onExecute) {
                    try {
                      const [, ...rest] = params;
                      onExecute(...rest);
                    } catch (err) {
                      out.error(err.message, { stack: err.stack });
                    }
                  } else {
                    process.stdout.write(
                      `Unknown command: ${colors.red(
                        command
                      )}.\nUse ${colors.green('help')} for the command list.\n`
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  };
  initFramework()
    .then(
      (): void => {
        out.verbose(colors.yellow.bold('Framework initialized'));
      }
    )
    .catch(
      (err: Error): void => {
        out.error(err.message, { stack: err.stack });
      }
    );
}
