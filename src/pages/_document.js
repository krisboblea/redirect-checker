import Document, { Html, Head, Main, NextScript } from "next/document";
import nextI18nConfig from '../../next-i18next.config'

class MyDocument extends Document {
  render() {

    const currentLocale = this.props.__NEXT_DATA__.locale
      || nextI18nConfig.i18n.defaultLocale

    return (
      <Html lang={currentLocale} >
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.png" sizes="32x32" />
          <link rel="icon" href="/favicon.png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <meta name="msapplication-TileImage" content="/favicon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
