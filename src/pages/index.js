import Head from "next/head";

import { Box, Flex, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { AppContainer } from "@/components/AppContainer";
import { Link } from "@chakra-ui/next-js";
import { getFluidFontSize } from "@/utils";

export default function Home() {
  const cardTagStyles = {
    display: "flex",
    fontSize: ".7em",
    padding: "5px",
    textAlign: "center",
    borderRadius: "3px",
    color: "#fff",
    backgroundColor: "#17b96e",
  };

  return (
    <>
      <Head>
        <title>Compare Redirect Service Speeds | Uptime & Response Times Comparison</title>
        <meta
          name="description"
          content="Find the fastest redirect services from RedirHub, Redirect.pizza, and EasyRedir with our comprehensive speed comparison tool. Check uptime, response times, and performance details in real-time."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AppContainer>
          <Stack gap="20px" textAlign="center" my="60px" maxW={{ lg: "60%" }} mx="auto">
            <Heading as="h1" size="text40" fontWeight="600">
              Redirect Services Performance Comparison
            </Heading>
            <Text>
              Discover which redirect service delivers the fastest response times and highest uptime with our real-time
              comparison tool.
            </Text>
          </Stack>

          <Box maxW={{ lg: "80%" }} mx="auto" borderBlockStart="1px solid var(--chakra-colors-gray-200)">
            <Box className="uptime-card" p="20px" borderBlockEnd="1px solid var(--chakra-colors-gray-200)">
              <HStack
                maxW="80%"
                mx="auto"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="30px"
                textAlign="center"
              >
                <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                  <Box>
                    <Box as="span" {...cardTagStyles}>
                      UP
                    </Box>
                  </Box>
                  <Stack textAlign="left" gap="10px">
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 30)} fontWeight="500">
                      NsLookup.io
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(14, 16)}>
                      <Link href="https://updown.io/fzba" target="_blank">
                        Last check: just now
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(16, 20)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(20, 30)}>
                      100%
                    </Box>
                  </Box>
                  <Link href="https://updown.io/fzba" target="_blank" color="blue.400">
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
            <Box className="uptime-card" p="20px" borderBlockEnd="1px solid var(--chakra-colors-gray-200)">
              <HStack
                maxW="80%"
                mx="auto"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="30px"
                textAlign="center"
              >
                <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                  <Box>
                    <Box as="span" {...cardTagStyles}>
                      UP
                    </Box>
                  </Box>
                  <Stack textAlign="left" gap="10px">
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 30)} fontWeight="500">
                      NsLookup.io
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(14, 16)}>
                      <Link href="https://updown.io/fzba" target="_blank">
                        Last check: just now
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(16, 20)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(20, 30)}>
                      100%
                    </Box>
                  </Box>
                  <Link href="https://updown.io/fzba" target="_blank" color="blue.400">
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
            <Box className="uptime-card" p="20px" borderBlockEnd="1px solid var(--chakra-colors-gray-200)">
              <HStack
                maxW="80%"
                mx="auto"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="30px"
                textAlign="center"
              >
                <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                  <Box>
                    <Box as="span" {...cardTagStyles}>
                      UP
                    </Box>
                  </Box>
                  <Stack textAlign="left" gap="10px">
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 30)} fontWeight="500">
                      NsLookup.io
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(14, 16)}>
                      <Link href="https://updown.io/fzba" target="_blank">
                        Last check: just now
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(16, 20)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(20, 30)}>
                      100%
                    </Box>
                  </Box>
                  <Link href="https://updown.io/fzba" target="_blank" color="blue.400">
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
            <Box className="uptime-card" p="20px" borderBlockEnd="1px solid var(--chakra-colors-gray-200)">
              <HStack
                maxW="80%"
                mx="auto"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="30px"
                textAlign="center"
              >
                <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                  <Box>
                    <Box as="span" {...cardTagStyles}>
                      UP
                    </Box>
                  </Box>
                  <Stack textAlign="left" gap="10px">
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 30)} fontWeight="500">
                      NsLookup.io
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(14, 16)}>
                      <Link href="https://updown.io/fzba" target="_blank">
                        Last check: just now
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(16, 20)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(20, 30)}>
                      100%
                    </Box>
                  </Box>
                  <Link href="https://updown.io/fzba" target="_blank" color="blue.400">
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
            <Box className="uptime-card" p="20px" borderBlockEnd="1px solid var(--chakra-colors-gray-200)">
              <HStack
                maxW="80%"
                mx="auto"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="30px"
                textAlign="center"
              >
                <HStack gap={{ base: "15px", md: "30px" }} flexWrap="wrap">
                  <Box>
                    <Box as="span" {...cardTagStyles}>
                      UP
                    </Box>
                  </Box>
                  <Stack textAlign="left" gap="10px">
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 30)} fontWeight="500">
                      NsLookup.io
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(14, 16)}>
                      <Link href="https://updown.io/fzba" target="_blank">
                        Last check: just now
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(16, 20)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(20, 30)}>
                      100%
                    </Box>
                  </Box>
                  <Link href="https://updown.io/fzba" target="_blank" color="blue.400">
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </AppContainer>
      </main>
    </>
  );
}
