import { Box, Flex, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { getFluidFontSize, getFormattedTimeDiff } from "@/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { SITES_TO_CHECK } from "../../data/data";

export default function CardList() {
  const [checksData, setChecksData] = useState([]);

  const cardTagStyles = {
    display: "flex",
    fontSize: getFluidFontSize(14, 16),
    padding: "5px",
    textAlign: "center",
    borderRadius: "3px",
    color: "#fff",
    backgroundColor: "#17b96e",
  };

  async function fetchChecks() {
    try {
      const responses = await Promise.all(
        SITES_TO_CHECK.map(async (site) => {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_UPDOWN_BASE_URL}/api/checks/${site}?api-key=${process.env.NEXT_PUBLIC_UPDOWN_API_KEY}`
          );
          return response.data;
        })
      );
      setChecksData(responses);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchChecks();
    // console.log(checksData);
  }, []);

  return (
    <Box maxW={{ lg: "80%" }} mx="auto" borderBlockStart="1px solid var(--chakra-colors-gray-200)">
      {checksData?.length > 0 &&
        checksData.map((data) => {
          return (
            <Box
              key={`${data.token}-${data.url}`}
              className="uptime-card"
              p="20px"
              borderBlockEnd="1px solid var(--chakra-colors-gray-200)"
            >
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
                    <Heading as="h4" className="uptime-card-title" fontSize={getFluidFontSize(20, 26)} fontWeight="500">
                      {data.alias && data.url ? `${data.alias} | ${data.url}` : `${data.url}`}
                    </Heading>
                    <Heading as="h5" className="uptime-card-subtitle" fontSize={getFluidFontSize(15, 17)}>
                      <Link href="https://updown.io/fzba" target="_blank" color="gray.500">
                        Last check: {getFormattedTimeDiff(data.last_check_at)}
                      </Link>
                    </Heading>
                  </Stack>
                </HStack>
                <HStack gap={{ base: "30px", md: "60px" }} flexWrap="wrap">
                  <Box className="uptime-card-uptime">
                    <Text color="gray.500" fontSize={getFluidFontSize(20, 24)}>
                      Uptime
                    </Text>
                    <Box as="span" fontSize={getFluidFontSize(26, 32)}>
                      {data.uptime}%
                    </Box>
                  </Box>
                  <Link
                    href="https://updown.io/fzba"
                    target="_blank"
                    color="blue.400"
                    fontSize={getFluidFontSize(16, 18)}
                  >
                    Details →
                  </Link>
                </HStack>
              </HStack>
            </Box>
          );
        })}
    </Box>
  );
}
