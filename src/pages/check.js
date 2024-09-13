import Head from "next/head";
import { Box, Container } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";

export default function RedirectCheck() {
    return (
        <MainLayout>
            <Head>
                <title>Redirect Check | RedirHub</title>
                <meta
                    name="description"
                    content="Check and analyze your redirects with RedirHub's powerful redirect checking tool."
                />
            </Head>
            <AppContainer>
                <Box my={12}>
                    {/* Add redirect check component here */}
                </Box>
            </AppContainer>
        </MainLayout>
    );
}