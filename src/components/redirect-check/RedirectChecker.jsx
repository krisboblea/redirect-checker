import { useState } from "react";
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
  Divider,
} from "@chakra-ui/react";
import { FaSearch, FaLink } from "react-icons/fa";
import RedirectResultList from "./RedirectResultList";

export default function RedirectChecker() {
  const [urls, setUrls] = useState('http://redirhub.com');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const subheadingColor = useColorModeValue("gray.600", "gray.400");

  const handleCheck = async () => {
    setIsLoading(true);
    setProgress(0);
    setResults([]);
    const urlList = urls.split("\n").filter((url) => url.trim() !== "");
    const totalUrls = urlList.length;

    for (let i = 0; i < totalUrls; i++) {
      try {
        const response = await fetch("/api/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlList[i] }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch redirect data for ${urlList[i]}`);
        }

        const data = await response.json();
        setResults((prevResults) => [...prevResults, {
          url: urlList[i],
          chainNumber: data.filter(item => /^30\d/.test(item.http_code)).length,
          statusCode: data[0].http_code,
          finalUrl: data[data.length - 1].url,
          totalTime: data.slice(0, data.length > 1 ? data.length - 1 : 1).reduce((sum, item) => sum + (item.alltime || 0), 0),
          chain: data,
        }]);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setProgress(((i + 1) / totalUrls) * 100);
      }
    }

    setIsLoading(false);
  };

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={16} align="stretch">
        <Flex direction="column" align="center" textAlign="center">
          <Box
            bg="blue.500"
            p={4}
            borderRadius="full"
            mb={6}
            boxShadow="lg"
          >
            <Icon as={FaLink} w={10} h={10} color="white" />
          </Box>
          <Heading as="h1" size="3xl" mb={4} color={headingColor} fontWeight="extrabold">
            Redirect Checker
          </Heading>
          <Text fontSize="xl" color={subheadingColor} maxW="2xl" lineHeight="tall">
            Analyze redirect chains and performance for multiple URLs at once.
          </Text>
        </Flex>
        <Box
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="xl"
          p={10}
          borderColor={borderColor}
          borderWidth={1}
        >
          <VStack spacing={8}>
            <Textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Enter URLs (one per line)&#10;e.g., https://example.com"
              rows={6}
              resize="vertical"
              bg={useColorModeValue("gray.50", "gray.700")}
              borderColor={borderColor}
              borderRadius="lg"
              _hover={{ borderColor: "blue.400" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)" }}
              fontSize="md"
            />
            <Divider />
            <Button
              leftIcon={<FaSearch />}
              colorScheme="blue"
              onClick={handleCheck}
              isLoading={isLoading}
              loadingText="Checking..."
              width={{ base: "full", md: "auto" }}
              size="lg"
              fontWeight="bold"
              px={10}
              py={7}
              borderRadius="full"
              boxShadow="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Check Redirects
            </Button>
          </VStack>
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
        {results.length > 0 && <RedirectResultList results={results} />}
      </VStack>
    </Container>
  );
}