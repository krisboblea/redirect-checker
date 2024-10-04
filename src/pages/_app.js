import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.scss";
import theme from "@/theme";
import { appWithTranslation } from "next-i18next";
import nextI18nConfig from '../../next-i18next.config'

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default appWithTranslation(App, nextI18nConfig);
