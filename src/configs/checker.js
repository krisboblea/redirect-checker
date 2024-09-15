// Extracted styles to a separate object
export const styles = {
    card: {
        transition: "all 0.3s ease",
        _hover: {
            boxShadow: "xl",
            transform: "translateY(-2px)",
        },
    },
    statusBadge: {
        display: "flex",
        alignItems: "center",
        fontSize: "md",
        gap: 2,
        px: 3,
        py: 1,
        borderRadius: "full",
        fontWeight: "medium",
        bg: "gray.100",
        color: "gray.800",
        _dark: {
            bg: "gray.700",
            color: "gray.100",
        },
    },
    providerBadge: {
        fontSize: "sm",
        gap: 2,
        px: 3,
        py: 1,
        borderRadius: "full",
        fontWeight: "medium",
        bg: "blue.100",
        color: "blue.800",
        _dark: {
            bg: "blue.700",
            color: "blue.100",
        },
        textTransform: "none", // Add this line to prevent uppercase transformation
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
        bg: "gray.50",
        _dark: {
            bg: "gray.700",
        },
        borderRadius: "md",
        p: 4,
        minWidth: "120px",
    },
    iconButton: {
        variant: "ghost",
        size: "sm",
        transition: "all 0.2s",
        colorScheme: "blue",
        _hover: {
            bg: 'blue.50',
            color: 'blue.600',
        },
        _active: {
            bg: 'blue.100',
        },
    },
    // Add new styles for the check page
    checkPage: {
        heroBox: {
            bg: "blue.500",
            p: 4,
            borderRadius: "full",
            mb: 6,
            boxShadow: "lg",
            _dark: {
                bg: "blue.700",
            },
        },
        heroIcon: {
            w: 12,
            h: 12,
            color: "white",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        },
        heading: {
            fontSize: { base: "3xl", md: "4xl", lg: "5xl" },
            mb: 4,
            fontWeight: "bold",
            bgGradient: "linear(to-r, blue.400, purple.500)",
            bgClip: "text",
        },
        description: {
            fontSize: { base: "lg", md: "xl" },
            maxW: "3xl",
            lineHeight: "tall",
            color: "gray.600",
            _dark: {
                color: "gray.300",
            },
        },
        container: {
            py: { base: 10, md: 16 },
        },
    },
};