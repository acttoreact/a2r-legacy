import { ApiNamespace } from './client-api';

const updateApiObject = (
  structure: ApiNamespace,
  keys: string[],
  methodName: string,
): ApiNamespace => {
  const lastIndex = keys.length - 1;
  return keys.reduce(
    (t: ApiNamespace, key: string, i: number): ApiNamespace => {
      if (i === lastIndex) {
        t.methods.push({
          key,
          methodName,
        });
        return t;
      }
      let namespace = t.namespaces.find((n): boolean => n.key === key);
      if (!namespace) {
        namespace = {
          key,
          namespaces: [],
          methods: [],
        };
        t.namespaces.push(namespace);
      }
      return namespace;
    },
    { ...structure },
  );
};

export default updateApiObject;
