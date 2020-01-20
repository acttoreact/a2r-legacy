import { AppContext } from 'next/app';
import getDataProvider from './getDataProvider';
import { getGlobalProvider } from './globalProps';
import { Session } from '../../model/session';
import { A2RContext } from '../../model/data';
// import out from '../../util/out';
// import { method } from '../../util/terminalStyles';

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
