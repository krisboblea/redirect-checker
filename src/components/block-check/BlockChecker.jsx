import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Textarea,
  VStack,
  Heading,
  Text,
  useToast,
  Progress,
  Container,
  useColorModeValue,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import BlockResultList from "./BlockResultList";
import { checkBlocks } from "./checkBlocks.js";
import { useTranslation } from "react-i18next";

export default function BlockChecker({ children, buttonText }) {
  const {t} = useTranslation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const [urls, setUrls] = useState('');

  const handleUrlsChange = (e) => {
    setUrls(e.target.value);
  };

  const handleCheck = useCallback(async () => {
    setIsLoading(true);
    setProgress(0);
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");

    await checkBlocks({ urlList, setProgress, toast, setResults });
    setIsLoading(false);
  }, [urls, toast]);

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 20 }}>
      <VStack spacing={{ base: 8, md: 16 }} align="stretch">
        {children}
        <Box>
          <Textarea
            value={urls}
            onChange={handleUrlsChange}
            placeholder={t('tool.block-checker-placeholder', 'Enter domains (one per line)')}
            rows={5}
          />
          <Button
            leftIcon={<FaSearch />}
            colorScheme="blue"
            onClick={handleCheck}
            isLoading={isLoading}
            loadingText={t('tool.checking', 'Checking...')}
            width="full"
            mt={4}
          >
            {buttonText}
          </Button>
        </Box>
        {isLoading && (
          <Progress
            value={progress}
            size="xs"
            colorScheme="blue"
            borderRadius="full"
            isAnimated
            hasStripe
          />
        )}
        {results.length > 0 && (
          <Box id="block-results">
            <BlockResultList results={results} />
          </Box>
        )}
      </VStack>
    </Container>
  );
}