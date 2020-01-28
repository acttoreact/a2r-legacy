/* eslint-disable @typescript-eslint/no-explicit-any */
import { ParsedUrlQuery } from 'querystring';

import { AppData, GetDataProvider, A2RGlobalProps } from '../../model/data';
import { A2RSession } from '../../model/session'; 
import { getGlobalProvider } from './globalProps';

let getDataProvider: GetDataProvider = () => {
  throw new Error('Not implemented');
};

export const setDataProvider = (newProvider: GetDataProvider): void => {
  getDataProvider = newProvider;
}

const getDataByServer = async (
  pathname: string,
  query: ParsedUrlQuery,
  sessionId: string,
): Promise<AppData> => {
  const session: A2RSession = {
    id: sessionId,
  };

  const globalPropsProvider = getGlobalProvider<A2RGlobalProps>();
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
