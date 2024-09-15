import Head from "next/head";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import RedirectChecker from "@/components/redirect-check/RedirectChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink } from "react-icons/fa";
import { styles } from "@/configs/checker";

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
                    <RedirectChecker>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaLink} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                Redirect Checker
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                Analyze redirect chains and performance for multiple URLs at once.
                            </Text>
                        </Flex>
                    </RedirectChecker>
                </Box>
            </AppContainer>
        </MainLayout>
    );
}