import ts from 'typescript';
import colors from 'colors';

import { CompilerFileInfo, ValidationErrorLevel } from './compiler';
import getMainMethodName from './getMainMethodName';
import getMainMethodNode from './getMainMethodNode';
import getFunctionDocContainer from './getFunctionDocContainer';
import getFunctionReturnTypeInfo from './getFunctionReturnTypeInfo';
import { method as methodOnLogs, fullPath } from '../../util/terminalStyles';
import fs from '../../util/fs';
import out from '../../util/out';

const must = colors.bold('must');

const getModuleInfo = async (filePath: string): Promise<CompilerFileInfo | null> => {
  out.verbose(`Getting module info from ${fullPath(filePath)}`);
  const content = await fs.readFile(filePath, 'utf8');
  const moduleInfo: CompilerFileInfo = {
    validationErrors: [],
    mainMethodParamNodes: [],
  };
  if (content) {
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
    const fileNodes = sourceFile.getChildren();
    moduleInfo.mainMethodName = getMainMethodName(fileNodes);
    moduleInfo.mainMethodNode = getMainMethodNode(fileNodes, moduleInfo.mainMethodName);
    if (moduleInfo.mainMethodNode) {
      out.verbose('Getting params');
      moduleInfo.mainMethodNode.forEachChild((child): void => {
        if (ts.isParameter(child)) {
          moduleInfo.mainMethodParamNodes.push(child);
        }
      });
      out.verbose('Getting docs');
      moduleInfo.mainMethodDocs = getFunctionDocContainer(moduleInfo.mainMethodNode);
      if (!moduleInfo.mainMethodDocs) {
        moduleInfo.validationErrors.push({
          level: ValidationErrorLevel.Error,
          message: `method ${methodOnLogs(moduleInfo.mainMethodName)} ${must} be documented`,
        });
      }
      out.verbose('Getting return type info');
      moduleInfo.mainMethodReturnTypeInfo = getFunctionReturnTypeInfo(moduleInfo.mainMethodNode);
      if (moduleInfo.mainMethodReturnTypeInfo) {
        if (moduleInfo.mainMethodReturnTypeInfo.identifier !== 'Promise') {
          moduleInfo.validationErrors.push({
            level: ValidationErrorLevel.Error,
            message: `method ${methodOnLogs(
              moduleInfo.mainMethodName,
            )} ${must} return a ${colors.green('Promise')}`,
          });
        }
      } else {
        moduleInfo.validationErrors.push({
          level: ValidationErrorLevel.Error,
          message: `method ${methodOnLogs(moduleInfo.mainMethodName)} ${must} have return type`,
        });
      }
    }
    // TODO: Inspect params and collect their types info as well
    out.verbose(`Module main method name: ${moduleInfo.mainMethodName}`);
    out.verbose(`Module main method number of params: ${moduleInfo.mainMethodParamNodes.length}`);
  }
  return moduleInfo;
};

export default getModuleInfo;
