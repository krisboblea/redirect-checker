import { Link } from "@chakra-ui/next-js";
import { Box, useColorModeValue } from "@chakra-ui/react";

const NavLink = ({ children, href, icon }) => (
    <Link
        px={3}
        py={2}
        rounded={"full"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.100", "gray.700"),
        }}
        href={href}
        display="flex"
        alignItems="center"
        transition="all 0.3s"
    >
        {icon}
        <Box ml={2}>{children}</Box>
    </Link>
);

export default NavLink;