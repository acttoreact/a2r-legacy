const executeApiMethod = async (method: string, params: any[]): Promise<any> => {
  try {
    const route = `./api/${method.replace(/\./g, '/')}`;
    console.log("executeApiMethod", method, route);
    const apiModule = await import(route);
    return apiModule.default(...params);
  } catch (ex) {
    console.log('error importing API module: ', ex.message, ex.stack);
    return { error: ex };
  }
};

export default executeApiMethod;
