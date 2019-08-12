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
import logo from './logo';

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
            const rl = readline.createInterface(process.stdin, process.stdout);
            rl.on(
              'line',
              (cmd: string): void => {
                const params = cmd.trim().split(' ');
                let command = params[0];
                if (command === 'quit') command = 'exit';

                switch (command) {
                  case 'exit':
                    process.stdout.write(
                      `Exiting  ${colors.magenta('A2R')} Framework\n`
                    );
                    value.close();
                    rl.close();
                    process.stdin.destroy();
                    process.exit();
                    break;
                  case 'logo':
                    process.stdout.write(`${logo}\n`);
                    break;
                  case 'setLogLevel':
                    if (params.length === 2) {
                      const level = params[1].toLowerCase();
                      out.setLevel(level);
                      process.stdout.write(
                        `Log level set to ${colors.green(level)}.\n`
                      );
                    } else {
                      process.stdout.write(
                        `You need to specify a log level.\nUse ${colors.green('help')} for the command list.\n`
                      );
                    }
                    
                    break;
                  case 'help':
                    process.stdout.write(`${logo}\n\n`);
                    process.stdout.write(`Commands:\n`);
                    process.stdout.write(`  ${colors.green('logo')}: display A2R Logo\n`);                    
                    process.stdout.write(`  ${colors.green('setLogLevel error') }: Set the log leve to error\n`);
                    process.stdout.write(`  ${colors.green('setLogLevel warning') }: Set the log leve to warning\n`);
                    process.stdout.write(`  ${colors.green('setLogLevel info') }: Set the log leve to info\n`);
                    process.stdout.write(`  ${colors.green('setLogLevel verbose') }: Set the log leve to verbose\n`);
                    process.stdout.write(`  ${colors.green('exit')}: exit the A2R Framework\n`);
                    process.stdout.write('\n');
                    break;
                  case '':
                    break;
                  default:
                    process.stdout.write(
                      `Unknown command: ${colors.red(command)}.\nUse ${colors.green('help')} for the command list.\n`
                    );
                }
              }
            );
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
