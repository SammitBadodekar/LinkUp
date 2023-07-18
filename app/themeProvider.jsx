"use client";
import { ThemeProvider } from "next-themes";

const themeProvider = ({ children }) => {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
};
export default themeProvider;
