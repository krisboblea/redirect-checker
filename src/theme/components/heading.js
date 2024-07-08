import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { fontSizes, getFluidFontSize } from "@/utils";

export const themeHeading = defineStyleConfig({
  baseStyle: {
    lineHeight: ["1.121"],
    fontWeight: "400",
  },
  sizes: {
    hero: defineStyle({
      fontSize: getFluidFontSize("100", "140"),
      lineHeight: ["1.121"],
    }),
    text80: defineStyle({
      fontSize: fontSizes.text80,
    }),
    text70: defineStyle({
      fontSize: fontSizes.text70,
    }),
    text60: defineStyle({
      fontSize: fontSizes.text60,
    }),
    text40: defineStyle({
      fontSize: fontSizes.text40,
    }),
    text30: defineStyle({
      fontSize: fontSizes.text30,
    }),
    text20: defineStyle({
      fontSize: fontSizes.text20,
    }),
    text16: defineStyle({
      fontSize: fontSizes.text16,
    }),
  },
});
