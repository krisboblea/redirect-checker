import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Badge,
  Flex,
  Icon,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  useBreakpointValue,
  Divider,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle, FaExternalLinkAlt, FaShare, FaShareAlt } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { useDevice } from '@/hooks/useDevice';

export default function BlockResultList({ results }) {
  const {t} = useTranslation();
  const { isMobile } = useDevice();
  const color = useColorModeValue("blue.500", "blue.300");
  const hoverColor = useColorModeValue("blue.600", "blue.400");
  const bgColor = useColorModeValue("gray.100", "gray.700"); // Store the value in a variable
  const toast = useToast();

  const handleShare = (urls) => {
    const urlString = Array.isArray(urls) ? urls.join(',') : urls;
    const shareUrl = `${window.location.origin}${window.location.pathname}?url=${encodeURIComponent(urlString)}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: t('tool.share-url-copied', 'Share URL copied!'),
          description: t('tool.share-url-copied-description', 'The result URL has been copied to your clipboard.'),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the URL.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleShareResult = (url) => handleShare(url);
  const handleShareAllResults = () => handleShare(results.map(result => result.url));

  return (
    <VStack spacing={6} align="stretch">
      <Flex justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
        <Heading as="h2" size={isMobile ? "lg" : "xl"}>
          {t('tool.block-checker-results', 'Block Check Results')}
        </Heading>
        <Button
          leftIcon={<FaShareAlt />}
          onClick={handleShareAllResults}
          variant="outline"
          colorScheme="blue"
          size={isMobile ? "sm" : "md"}
        >
          {t('tool.share-all', 'Share All')}
        </Button>
      </Flex>
      <Box
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        bg={useColorModeValue("white", "gray.800")}
      >
        <Table variant="striped" colorScheme="gray" size={useBreakpointValue({ base: "sm", md: "md" })}>
          <Thead>
            <Tr>
              <Th fontWeight="bold" fontSize="lg">{t('tool.domain', 'Domain')}</Th>
              <Th fontWeight="bold" fontSize="lg">HTTP</Th>
              <Th fontWeight="bold" fontSize="lg">HTTPS</Th>
              <Th fontWeight="bold" fontSize="lg">{t('tool.total-time', 'Total Time (s)')}</Th>
              <Th fontWeight="bold" fontSize="lg">{t('tool.actions', 'Actions')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {results.map((result, index) => (
              <Tr key={`${result.url}-${index}`} 
                  _hover={{ bg: bgColor, boxShadow: "lg" }} // Added hover effect
                  transition="background 0.3s ease, transform 0.3s ease" // Smooth transition
              >
                <Td>
                  <Flex alignItems="center" justifyContent="space-between"> 
                    <Text fontWeight="medium" fontSize="md">{result.url}</Text>
                    <Tooltip label={t('tool.open-in-new', 'Open URL in new tab')}>
                      <Icon
                        as={FaExternalLinkAlt}
                        cursor="pointer"
                        ml={2}
                        boxSize={4}
                        color={color}
                        onClick={() => window.open('http://' + result.url, '_blank')}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td>
                    <Icon 
                    as={result.http_pass ? FaCheckCircle : FaTimesCircle} 
                    size={'lg'}
                    mr={2}
                    color={result.http_pass ? "green.500" : "red.500"}
                    />
                    <span>{result.http_pass ? t('tool.passed', 'Passed') : t('tool.blocked', 'Blocked')}</span>
                </Td>
                <Td>
                    <Icon 
                    as={result.https_pass ? FaCheckCircle : FaTimesCircle} 
                    size={'lg'}
                    mr={2}
                    color={result.https_pass ? "green.500" : "red.500"}
                    />
                    <span>{result.https_pass ? t('tool.passed', 'Passed') : t('tool.blocked', 'Blocked')}</span>
                </Td>
                <Td>
                  <Text fontWeight="medium">{(result.total_time / 1000).toFixed(2)} s</Text>
                </Td>
                <Td>
                  <Tooltip label={t('tool.share', 'Share')}>
                    <IconButton
                      icon={<FaShare />}
                      aria-label="Share result"
                      onClick={() => handleShareResult(result.url)}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </Tooltip>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Divider />
    </VStack>
  );
}