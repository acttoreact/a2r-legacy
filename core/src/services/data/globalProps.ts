// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalProvider: any;

export const registerGlobal = <GlobalPropsType>(
  provider: () => GlobalPropsType | Promise<GlobalPropsType>,
): void => {
  globalProvider = provider;
};

export const getGlobalProvider = <GlobalPropsType>(): (() => GlobalPropsType | Promise<GlobalPropsType>) => {
  return (globalProvider as () => GlobalPropsType | Promise<GlobalPropsType>);
}

export default {
  registerGlobal,
  getGlobalProvider,
};
