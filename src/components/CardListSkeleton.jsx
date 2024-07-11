import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";

export default function CardListSkeleton() {
  const bgColor = { bg: "var(--chakra-colors-gray-200)" };
  const stylesBigTag = {
    className: "btn-tag-big",
    display: "flex",
    width: "30px",
    height: "30px",
    padding: "5px",
    borderRadius: "3px",
    ...bgColor,
  };

  return (
    <Box mx="auto">
      {[...Array(3).fill("card")].map((item, index) => (
        <Box
          key={`${item}-${index}`}
          className="uptime-card-skeleton"
          p="20px"
          borderBlockEnd="1px solid var(--chakra-colors-gray-200)"
        >
          <Grid maxW={{ lg: "90%" }} mx="auto" gap="60px" gridTemplateColumns="1fr 1fr">
            <GridItem>
              <Grid gap={{ base: "15px", md: "30px" }} alignItems="center" gridTemplateColumns="auto 1fr">
                <GridItem>
                  <Box as="span" {...stylesBigTag}></Box>
                </GridItem>
                <GridItem textAlign="left" display="grid" gap="10px">
                  <Box as="span" className="uptime-card-title" display="flex" w="100%" h="25px" {...bgColor} />
                  <Box as="span" className="uptime-card-subtitle" display="flex" w="60%" h="15px" {...bgColor} />
                </GridItem>
              </Grid>
            </GridItem>
            <GridItem>
              <Grid gap={{ base: "15px", md: "30px" }} gridTemplateColumns="repeat(3,1fr)" alignItems="center">
                <GridItem className="uptime-card-uptime" display="grid" gap="10px">
                  <Box as="span" display="flex" w="100%" h="20px" {...bgColor} />
                  <Box as="span" display="flex" w="60%" h="15px" {...bgColor} />
                </GridItem>
                <GridItem className="uptime-card-uptime" display="grid" gap="10px">
                  <Box as="span" display="flex" w="100%" h="20px" {...bgColor} />
                  <Box as="span" display="flex" w="60%" h="15px" {...bgColor} />
                </GridItem>
                <GridItem gap="10px" display="grid" gridTemplateColumns="1fr auto" alignItems="center">
                  <Box as="span" w="100%" h="16px" {...bgColor} />
                  <Flex as="span" w="25px" h="15px" {...bgColor} />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
