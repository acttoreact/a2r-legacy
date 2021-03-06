const model = new Map<string, string>();

export const addKeys = (keys: string[], filePath: string): Map<string, string> => {
  for (let i = 0, l = keys.length; i < l; i += 1) {
    model.set(keys[i], filePath);
  }
  return model;
};

export const removeKeys = (path: string): Map<string, string> => {
  const keys = Array.from(model.entries()).reduce((t, [key, filePath]): string[] => {
    if (filePath === path) {
      t.push(key);
    }
    return t;
  }, new Array<string>());
  for (let i = 0, l = keys.length; i < l; i += 1) {
    model.delete(keys[i]);
  }
  return model;
}

export const clear = (): Map<string, string> => {
  model.clear();
  return model;
}

export const getKeys = (): string[] => {
  return Array.from(model.keys());
}

export const getPaths = (): string[] => {
  return Array.from(new Set(model.values()));
}

export default model;