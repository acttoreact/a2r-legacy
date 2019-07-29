import colors from "colors";
import path from "path";
import fs from "fs";
import out from "../util/out";

export default async (): Promise<void> => {
  out.info(
    colors.yellow.bold(
      `>>> Initializing project for ${colors.yellow.magenta("A2R")} Framework`
    )
  );
  out.verbose(`Current path is ${__dirname}`);

  const modePath = path.join(__dirname, "../../model");
  const targetPath = path.join(__dirname, "../../../..");
  out.verbose(`Model path is ${modePath}`);
  out.verbose(`Target path is ${targetPath}`);

  function existsPath(pathToCheck: string): Promise<boolean> {
    return new Promise<boolean>(
      (resolve: (result: boolean) => void): void => {
        fs.exists(
          pathToCheck,
          (exists: boolean): void => {
            resolve(exists);
          }
        );
      }
    );
  }

  async function copyModelContents(relPath: string): Promise<void> {
    const contents = await fs.promises.readdir(modePath + relPath);
    await Promise.all(
      contents.map(
        async (content: string): Promise<void> => {
          let newContent = content;


          const fullSourcePath = `${modePath}${relPath}/${content}`;
          let fullDestinationPath = `${modePath}${relPath}/${content}`;

          out.verbose(`Full source path: ${fullSourcePath}`);

          if (fullDestinationPath.endsWith(".model")) {
            fullDestinationPath = fullDestinationPath.substring(
              0,
              fullDestinationPath.length - 6
            );
            newContent = newContent.substring(
              0,
              fullDestinationPath.length - 6
            );
          }

          out.verbose(`Full destination path: ${fullDestinationPath}`);

          const info = await fs.promises.lstat(fullSourcePath);

          out.verbose(`Source is directory: ${info.isDirectory()}`);

          if (info.isDirectory()) {
            if (!existsPath(fullDestinationPath)) {
              out.verbose(`Creating directory: ${fullDestinationPath}`);
              await fs.promises.mkdir(fullDestinationPath);
            }
            await copyModelContents(`${relPath}/${content}`);
          } else {
            out.info(
              colors.green(
                `Generating file ${colors.yellow.bold.cyan(
                  `${relPath}/${newContent}`
                )}.`
              )
            );
            await fs.promises.copyFile(fullSourcePath, fullDestinationPath);
          }
        }
      )
    );
  }
  await copyModelContents('');
};
