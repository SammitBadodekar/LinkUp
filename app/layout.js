import "./globals.css";
import { Inter } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/authProvider";
import { UserProvider } from "@/context/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkUp",
  description:
    "The real-time chat app with Google login, custom rooms, and seamless connections. Join, chat, and collaborate effortlessly with like-minded individuals in a secure and engaging environment. Stay connected and build meaningful connections with LinkUp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden dark:bg-darkTheme dark:text-white`}
      >
        <UserProvider>
          <AuthProvider>
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
                  background: "#fff",
                  color: "#363636",
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
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
