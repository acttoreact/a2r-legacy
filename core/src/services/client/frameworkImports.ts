import { ImportItem } from '../../model/client';

const frameworkImports: ImportItem[] = [
  {
    importPath: '../model',
    namedImports: [
      'SocketMessage',
      'MethodCall',
    ],
  },
  {
    importPath: './dist/services/sockets/getSocket',
  },
];

export default frameworkImports;
