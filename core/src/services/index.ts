import apiCompiler from './apiCompiler';
import out from '../util/out';

const services = async (): Promise<void> => {
  out.verbose(`Starting services...`);
  try {
    await apiCompiler();
  } catch (apiCompilerErr) {
    out.error(`Error in Api Compiler: ${apiCompilerErr.message}`, {
      stack: apiCompilerErr.stack,
    });
  }  
  out.verbose(`Services started...`);
};

export default services;
