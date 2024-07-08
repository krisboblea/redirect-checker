import { Box } from "@chakra-ui/react";

export function AppContainer({ children, ...rest }) {
  return (
    <Box className="app-container" maxWidth="1400px" mx="auto" px="30px" {...rest}>
      {children}
    </Box>
  );
}
