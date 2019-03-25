import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

class MyDocument extends Document {
  static getInitialProps(ctx) {
    let pageContext;
    const page = ctx.renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext;
        return <Component {...props} />;
      };
      return WrappedComponent;
    });

    return {
      ...page,
      pageContext,
      styles: (
        <React.Fragment>
          <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: pageContext.sheetsRegistry.toString() }} />
          {flush() || null}
        </React.Fragment>
      ),
    };
  }

  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en" dir="ltr">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content={'user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height'} />
          <meta name="theme-color" content={pageContext.theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
