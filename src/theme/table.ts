import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)

const baseStyle = definePartsStyle({
    table: {
      overflowX: "auto",
      whiteSpace: "nowrap"
    },
    thead: {
      fontFamily: "'JetBrains Mono', monospace",
      bg: "white",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    th: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.875rem", 
      lineHeight: "1.25rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "200px", 
    },
    tbody: {
      bg: "#F7F7F7", 
      color: "black",
    },
    td: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.875rem", 
      color: "black",
      lineHeight: "1.25rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "150px", 
    },
  });

export const tableTheme = defineMultiStyleConfig({ baseStyle })