import { FaRocket } from "react-icons/fa";

// Extracted styles to a separate object
export const styles = {
    card: {
        transition: "all 0.3s ease",
        _hover: {
            boxShadow: "xl",
            transform: "translateY(-2px)",
        },
        bg: 'white',
        _dark: {
            bg: "gray.800",
        },
    },
    statusBadge: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 3,
        py: 1,
        borderRadius: "full",
        fontWeight: "medium",
        color: 'gray.800',
        _dark: {
            color: 'gray.100',
        },
    },
    fastestBadge: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: "full",
        bg: "yellow.100",
        color: "yellow.800",
        _dark: {
            bg: "yellow.700",
            color: "yellow.100",
        },
        fontWeight: "medium",
        fontSize: "sm",
    },
    statItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "md",
        p: 4,
        bg: "gray.50",
        color: "gray.800",
        _dark: {
            bg: "gray.700",
            color: "gray.100",
        },
    },
    getStartedButton: {
        as: "a",
        size: "lg",
        bg: "green.300",
        color: "gray.800",
        _dark: {
            bg: "gray.700",
            color: "gray.100",
        },
        rightIcon: <FaRocket />,
        _hover: { transform: "translateY(-2px)", boxShadow: "lg" },
        transition: "all 0.3s",
    },
};