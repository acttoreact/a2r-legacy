/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedUrlQuery } from 'querystring';

import { AppData, GetDataProvider } from '../../model/data';
import { Session } from '../../model/session'; 
import { getGlobalProvider } from './globalProps';

let getDataProvider: GetDataProvider = () => {
  throw new Error('Not implemented');
};

export const setDataProvider = (newProvider: GetDataProvider): void => {
  getDataProvider = newProvider;
}

const getDataByServer = async <GlobalProps>(
  pathname: string,
  query: ParsedUrlQuery,
  sessionId: string,
): Promise<AppData> => {
  const session: Session = {
    id: sessionId,
  };

  const globalPropsProvider = getGlobalProvider<GlobalProps>();
  const globalProps = globalPropsProvider ? await globalPropsProvider() : {};

  const a2rContext = {
    query,
    session,
    globalProps,
  };

  const pageDataProvider = await getDataProvider(pathname);
  const data = pageDataProvider ? await pageDataProvider(a2rContext) : {};

  return {
    sessionId,
    data: {
      ...globalProps,
      ...data,
    },
  };
};

export default getDataByServer;
