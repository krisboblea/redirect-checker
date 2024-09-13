import { Box, Flex, Button, useColorModeValue, Stack, useColorMode } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import Image from "next/image";
import { FaSun, FaMoon, FaHome, FaCheckCircle, FaBolt, FaBlog } from "react-icons/fa";

const NavLink = ({ children, href, icon }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={href}
        display="flex"
        alignItems="center"
    >
        {icon}
        <Box ml={2}>{children}</Box>
    </Link>
);

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box bg={useColorModeValue("white", "gray.900")} px={4} boxShadow="sm">
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <Box>
                    <Link href="/">
                        <Image src="/logo.png" alt="RedirHub Logo" width={120} height={40} />
                    </Link>
                </Box>

                <Flex alignItems={"center"}>
                    <Stack direction={"row"} spacing={7}>
                        <NavLink href="/" icon={<FaHome />}>Home</NavLink>
                        <NavLink href="/check" icon={<FaCheckCircle />}>Redirect Check</NavLink>
                        <NavLink href="/redirect-speed" icon={<FaBolt />}>Speed Analysis</NavLink>
                        <NavLink href="/blog" icon={<FaBlog />}>Blog</NavLink>
                        <Button onClick={toggleColorMode} aria-label="Toggle color mode">
                            {colorMode === "light" ? <FaMoon /> : <FaSun />}
                        </Button>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}