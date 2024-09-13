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
        textTransform: "uppercase",
        bg: "blue.100",
        color: "blue.800",
        _dark: {
            bg: "blue.700",
            color: "blue.100",
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
        bg: "gray.50",
        _dark: {
            bg: "gray.700", // Dark mode background
        },
        borderRadius: "md",
        p: 4,
        minWidth: "120px",
    },
};