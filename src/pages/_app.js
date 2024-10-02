import { ChakraProvider } from "@chakra-ui/react";
import "@/styles/globals.scss";
import theme from "@/theme";
import { I18nextProvider } from "react-i18next";
import i18n from "@/configs/i18n";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </ChakraProvider>
  );
}
