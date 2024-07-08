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
          bg: "var(--chakra-colors-black)",
          color: "var(--chakra-colors-white)",
          _hover: {
            bg: "var(--chakra-colors-primary)",
          },
        };
      }

      if (c === "white") {
        return {
          bg: "var(--chakra-colors-white)",
          color: "var(--chakra-colors-black)",
          _hover: {
            bg: "var(--chakra-colors-white)",
            color: "var(--chakra-colors-black)",
          },
        };
      }

      if (c === "primary") {
        return {
          bg: "var(--chakra-colors-primary)",
          color: "var(--chakra-colors-white)",
          _hover: {
            bg: "var(--chakra-colors-primary)",
            color: "var(--chakra-colors-white)",
          },
        };
      }

      return {};
    }),
  },
});
