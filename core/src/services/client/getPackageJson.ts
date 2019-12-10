const getPackageJson = (): string => {
  const info = {
    main: './api.js',
  };

  return JSON.stringify(info);
};

export default getPackageJson;
