/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'a2r/react';
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'a2r/document';
import { ServerStyleSheet } from 'a2r/styled-components';

import { GlobalProps } from '../config/data';

export default class MyDocument extends Document<GlobalProps> {
  public static async getInitialProps(ctx: DocumentContext): Promise<any> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = (): any =>
        originalRenderPage({
          enhanceApp: App => (props): any => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  public render(): JSX.Element {
    return (
      <Html lang="es-ES">
        <Head>
          <meta name="viewport" content="width=device-width" />
          <link rel="stylesheet" type="text/css" href="/css/reset.css" />
          <link rel="stylesheet" type="text/css" href="/css/default.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
