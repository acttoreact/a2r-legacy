import App, { AppInitialProps, AppContext } from 'next/app';
import React, { createContext, useContext } from 'react';
import { A2RPageProps } from '../model/data';
import { getGetData } from '../services/data/getData';

const SessionContext = createContext<string>('');
const PagePropsContext = createContext<A2RPageProps>({});

class A2RApp extends App {
  public static async getInitialProps({ ctx }: AppContext): Promise<AppInitialProps> {
    const getData = getGetData();
    const { data, sessionId } = await getData(ctx);
    return {
      pageProps: {
        sessionId,
        ...data,
      },
    };
  }

  public getMemoComponent(): JSX.Element {
    const MemoComponent = React.memo(this.props.Component);
    return <MemoComponent {...this.props.pageProps} />;
  }
}

SessionContext.displayName = 'SessionProvider';
PagePropsContext.displayName = 'PagePropsProvider';

export const SessionProvider = SessionContext.Provider;
export const PagePropsProvider = PagePropsContext.Provider;
export const useSessionId = (): string => useContext(SessionContext);
export const usePageProps = <
  GlobalProps extends A2RPageProps = A2RPageProps
>(): React.Context<GlobalProps> =>
  useContext<A2RPageProps>(PagePropsContext) as React.Context<GlobalProps>;

export default A2RApp;
