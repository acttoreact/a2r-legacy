import { ImportItem } from '../../model/client';

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
