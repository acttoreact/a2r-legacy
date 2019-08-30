export function dispose() {
  console.log('Hello, this is the dispose method for sub.withDispose module');
};

export default (): void => { console.log('Hello, this should be sub.withDispose')};
