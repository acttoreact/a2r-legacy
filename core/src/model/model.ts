import { PackageJSON } from '.';

export interface ModelPackageJSON extends PackageJSON {
  main: string;
}