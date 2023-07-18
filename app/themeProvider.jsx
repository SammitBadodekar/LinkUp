"use client";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import toast, { Toaster } from "react-hot-toast";

const themeProvider = ({ children }) => {
  const { theme } = useTheme();
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      {children}
      <Toaster
        position="top-center"
        reverseOrder={true}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 3000,
          style: {
            background: "#636363",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "white",
              secondary: "black",
            },
          },
        }}
      />
    </ThemeProvider>
  );
};
export default themeProvider;
