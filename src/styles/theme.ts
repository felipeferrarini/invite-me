import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    red: {
      "500": "#9D0D17",
    },
    gray: {
      "900": "#1A1A1A",
    },
  },
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.900",
      },
      "*": {
        "&::-webkit-scrollbar": {
          width: "5px",
        },

        "&::-webkit-scrollbar-thumb": {
          bg: "red.500",
          borderRadius: "5px",
        },

        "&::-webkit-scrollbar-track": {
          backgroundColor: "white",
          borderRadius: 0,
        },
      },
    },
  },
});
