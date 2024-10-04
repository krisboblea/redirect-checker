import { useState, useMemo } from "react";
import { Box, Flex, Heading, Icon, Text, Grid, GridItem, VStack, Input, InputGroup, InputLeftElement, Button, useColorModeValue } from "@chakra-ui/react";
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { QUESTION_URL } from "@/configs/constant";

// Styles object
const styles = {
  container: {
    py: 12,
    px: 4,
    borderRadius: "xl",
  },
  heading: {
    as: "h2",
    size: "xl",
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    maxW: "800px",
    mx: "auto",
  },
  searchInput: {
    maxW: "600px",
    mx: "auto",
  },
  faqGrid: {
    templateColumns: { base: "1fr", lg: "repeat(2, 1fr)" },
    gap: 8,
  },
  faqItem: {
    borderWidth: "1px",
    borderRadius: "lg",
    p: 6,
    boxShadow: "md",
    transition: "all 0.3s",
    _hover: { boxShadow: "lg" },
  },
  faqQuestion: {
    as: "h3",
    size: "md",
    lineHeight: "1.2",
    fontWeight: "semibold",
  },
  faqAnswer: {
    lineHeight: "1.6",
  },
  noResults: {
    textAlign: "center",
    color: "gray.500",
  },
  contactButton: {
    colorScheme: "blue",
    leftIcon: <FaQuestionCircle />,
  },
};

export default function FAQSection({ data }) {

    const {t} = useTranslation();
    const [openIndices, setOpenIndices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFAQs = useMemo(() => {
        return data.filter(faq => 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, data]);

    const toggleFAQ = (index) => {
        setOpenIndices(prevIndices => 
            prevIndices.includes(index)
                ? prevIndices.filter(i => i !== index)
                : [...prevIndices, index]
        );
    };

    // Color mode values
    const bgColor = useColorModeValue("gray.50", "gray.900");
    const cardBgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.300");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    return (
        <Box bg={bgColor} {...styles.container}>
            <VStack spacing={8} align="stretch">
                <Heading {...styles.heading}>
                    {t('tool.faq-title', 'Frequently Asked Questions')}
                </Heading>
                <Text {...styles.subText} color={textColor}>
                    {t('tool.faq-subtext', "Find answers to common questions about this tool. Can't find what you're looking for? Contact our support team for more help.")}
                </Text>
                <InputGroup {...styles.searchInput}>
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FaSearch} color="gray.300" />
                    </InputLeftElement>
                    <Input 
                        placeholder={t('tool.faq-search-placeholder', 'Search FAQs...')} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        bg={cardBgColor}
                    />
                </InputGroup>
                <Grid {...styles.faqGrid}>
                    {filteredFAQs.map((faq, index) => (
                        <GridItem key={index}>
                            <Box 
                                {...styles.faqItem}
                                bg={cardBgColor}
                                borderColor={borderColor}
                            >
                                <VStack align="stretch" spacing={4}>
                                    <Flex justify="space-between" align="center" onClick={() => toggleFAQ(index)} cursor="pointer">
                                        <Heading {...styles.faqQuestion}>
                                            {faq.question}
                                        </Heading>
                                        <Icon 
                                            as={openIndices.includes(index) ? FaChevronUp : FaChevronDown} 
                                            color="blue.500"
                                        />
                                    </Flex>
                                    {openIndices.includes(index) && (
                                        <Text color={textColor} {...styles.faqAnswer}>
                                            {faq.answer}
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
                {filteredFAQs.length === 0 && (
                    <Text {...styles.noResults}>
                        {t('tool.faq-no-results', 'No matching questions found. Please try a different search term.')}
                    </Text>
                )}
                <Box textAlign="center">
                    <Link href={QUESTION_URL} target="_blank">
                        <Button {...styles.contactButton}>
                            {t('tool.faq-contact-button', 'Still have questions?')}
                        </Button>
                    </Link>
                </Box>
            </VStack>
        </Box>
    );
}