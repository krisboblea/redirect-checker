import Head from "next/head";
import { Box } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { APP_NAME } from "@/configs/constant";

export default function RedirectCheckPage() {
    return (
        <MainLayout>
            <Head>
                <title>Bulk Redirect Checker: Analyze URL Chains & Speed Compare | {APP_NAME}</title>
                <meta
                    name="description"
                    content="Instantly check and analyze your URL redirects with our powerful tool. Uncover redirect chains, measure speed, and optimize your website's performance. Try our free redirect checker now!"
                />
            </Head>
            <AppContainer>
                <Box my={12}>
                    <RedirectChecker />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}