// Extracted styles to a separate object
export const styles = {
    card: {
        transition: "all 0.3s ease",
        _hover: {
            boxShadow: "xl",
            transform: "translateY(-2px)",
        },
        bg: {
            light: "white",
            dark: "gray.800",
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
        color: {
            light: "gray.800",
            dark: "gray.100",
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
        minWidth: "180px",
        bg: {
            light: "gray.50",
            dark: "gray.700",
        },
        color: {
            light: "gray.800",
            dark: "gray.100",
        },
    },
};