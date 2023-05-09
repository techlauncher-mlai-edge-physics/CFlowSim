import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: hsl(0, 0%, 100%);
  color: hsl(0, 1%, 16%);
  font-family: monospace;
  overflow-x: hidden;
}

body {
    background-color: ${({ theme }) => theme.colors.background};
color: ${({ theme }) => theme.colors.text};
font-family: monospace;
overflow-x: hidden;
}

// theme buttons color
.light {
    background-color: ${theme.light.colors.header};
}
.dark {
    background-color: ${theme.dark.colors.header};
}

// active theme
.active{
    border: 3px solid ${({ theme }) => theme.colors.border};
}




`
