import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/authProvider";
import { UserProvider } from "@/context/userContext";
import ThemeProvider from "./themeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkUp",
  description:
    "The real-time chat app with Google login, custom rooms, and seamless connections. Join, chat, and collaborate effortlessly with like-minded individuals in a secure and engaging environment. Stay connected and build meaningful connections with LinkUp.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-x-hidden bg-white text-darkTheme dark:bg-darkTheme dark:text-slate-200 sm:overflow-hidden`}
      >
        <UserProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
