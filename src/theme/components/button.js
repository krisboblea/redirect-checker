import { defineStyle } from "@chakra-ui/react";

export const themeButton = defineStyle({
  baseStyle: {
    fontSize: "var(--font-body)",
    borderRadius: "0",
    transition: "200ms",
  },
  defaultProps: {
    size: "default",
    colorScheme: "default",
  },
  sizes: {
    default: defineStyle({
      h: { base: "50px" },
      px: "30px",
      py: "15px",
      fontSize: { base: "16px" },
      lineHeight: "1.5",
      fontWeight: "400",
    }),
  },
  variants: {
    solid: defineStyle((props) => {
      const { colorScheme: c } = props;

      if (c === "default") {
        return {
          bg: "black",
          color: "white",
          _hover: {
            bg: "primary",
          },
          _dark: {
            bg: "white",
            color: "black",
            _hover: {
              bg: "primary",
              color: "white",
            },
          },
        };
      }

      if (c === "white") {
        return {
          bg: "white",
          color: "black",
          _hover: {
            bg: "gray.100",
          },
          _dark: {
            bg: "gray.800",
            color: "white",
            _hover: {
              bg: "gray.700",
            },
          },
        };
      }

      if (c === "primary") {
        return {
          bg: "primary",
          color: "white",
          _hover: {
            bg: "primary.600",
          },
          _dark: {
            bg: "primary",
            color: "white",
            _hover: {
              bg: "primary.400",
            },
          },
        };
      }

      return {};
    }),
  },
});
