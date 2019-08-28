import apiCompiler from './apiCompiler';
import out from '../util/out';

const services = (): void => {
  apiCompiler().catch((apiCompilerErr): void => {
    out.error(`Error in Api Compiler: ${apiCompilerErr.message}`, {
      stack: apiCompilerErr.stack,
    });
  });
};

export default services ;
