import { AppContext } from 'next/app';
import { GetData, DataProvider, A2RContext} from '../../model/data';
import { getGlobalProvider } from './globalProps';
import { Session } from '../../model/session';

let getDataProvider:DataProvider = async <ReturnType>(pathname: string): Promise<GetData<ReturnType>> => {
  throw new Error('Not implemented');
};

export const setDataProvider = (newProvider: DataProvider): void => {
  getDataProvider = newProvider;
}

const getData = async <GlobalPropsType = {}, SessionPropsType extends Session = Session>(
  appContext: AppContext,
  sessionId: string,
): Promise<GlobalPropsType | {}> => {
  const { router } = appContext;
  const { query, pathname } = router;

  interface CurrentA2RContext extends A2RContext {
    globalProps: GlobalPropsType | {};
    session: SessionPropsType | Session;
  }

  const session: SessionPropsType | Session = {
    id: sessionId,
  };

  // if (Component.getInitialProps) {
  //   out.warn(`You should use ${method('getData')} method instead of ${method('getInitialProps')}.`);
  // }

  const globalProvider = getGlobalProvider<GlobalPropsType>();
  const globalProps = globalProvider ? await globalProvider() : {};

  const a2rContext: CurrentA2RContext = {
    query,
    session,
    globalProps,
  };

  const dataProvider = await getDataProvider<GlobalPropsType>(pathname);
  const data = dataProvider ? await dataProvider(a2rContext) : {};

  return data;
};

export default getData;
