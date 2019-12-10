import { ImportItem } from './client-api';

const frameworkImports: ImportItem[] = [
  {
    importPath: '../../services/sockets',
    namedImports: [
      'SocketMessage',
      'MethodCall',
    ],
  },
  {
    importPath: './getSocket',
  },
];

export default frameworkImports;
