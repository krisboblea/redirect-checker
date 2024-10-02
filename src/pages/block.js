import { useState, useMemo } from "react";
import Head from "next/head";
import { Box, Flex, Heading, Icon, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, Grid, GridItem, VStack, Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { AppContainer } from "@/components/common/AppContainer";
import BlockChecker from "@/components/block-check/BlockChecker";
import { APP_NAME } from "@/configs/constant";
import { FaLink, FaShieldVirus } from "react-icons/fa";
import { styles } from "@/configs/checker";
import FAQSection from "@/components/common/FAQSection";

export default function DomainBlockPage() {

    const faqData = [
        {
            "question": "What is the Domain Block by GFW China tool?",
            "answer": "The Domain Block by GFW China tool helps users check if a specific domain is blocked by the Great Firewall of China. It provides insights into accessibility issues for users in China."
        },
        {
            "question": "How does the Great Firewall of China work?",
            "answer": "The Great Firewall of China is a system of internet censorship that blocks access to certain foreign websites and slows down cross-border internet traffic. It is used to control the information available to Chinese citizens."
        },
        {
            "question": "Why is it important to check if a domain is blocked?",
            "answer": "Checking if a domain is blocked is crucial for businesses and individuals who want to ensure their content is accessible to users in China. Blocked domains can lead to loss of traffic and engagement."
        },
        {
            "question": "How can I use the Domain Block tool?",
            "answer": "Simply enter the domain you wish to check in the provided input field and click the 'Check Domain' button. The tool will analyze the domain's accessibility from within China."
        },
        {
            "question": "What should I do if my domain is blocked?",
            "answer": "If your domain is blocked, consider using alternative domains, VPN services, or other methods to ensure your content reaches users in China."
        },
        {
            "question": "Can I check multiple domains at once?",
            "answer": "Yes, our tool allows you to check multiple domains simultaneously, providing a comprehensive overview of their accessibility."
        }
    ];

    return (
        <MainLayout>
            <Head>
                <title>Domain Block Checker: Verify Accessibility in China | {APP_NAME}</title>
                <meta
                    name="description"
                    content="Check if your domain is blocked by the Great Firewall of China. Ensure your content is accessible to users in China with our reliable tool."
                />
            </Head>
            <AppContainer>
                <Box my={12}>
                    <BlockChecker icon={FaLink} buttonText="Check Domain" examples={[ "example.com", "test.com", "sample.com" ]}>
                        <Flex direction="column" align="center" textAlign="center">
                            <Box {...styles.checkPage.heroBox}>
                                <Icon as={FaShieldVirus} {...styles.checkPage.heroIcon} />
                            </Box>
                            <Heading as="h1" {...styles.checkPage.heading}>
                                Domain Block Checker
                            </Heading>
                            <Text {...styles.checkPage.description}>
                                Verify if your domain is accessible from China and avoid potential traffic loss.
                            </Text>
                        </Flex>
                    </BlockChecker>
                    <FAQSection data={faqData} />
                </Box>
            </AppContainer>
        </MainLayout>
    );
}