import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/Theme/useTheme";
import NextAuthProvider from "@/Providers/NextAuthProvider";
import ClientLayoutWrapper from "./components/ClientLayoutWrapper";
import { ReduxProvider } from "@/lib/Provider";


export const metadata = {
  title: "paritto",
  description: "Blog site",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body>
<ReduxProvider>
<NextAuthProvider>
     <ToastContainer />
      <ThemeProvider>
      <ClientLayoutWrapper>
        {children}
      </ClientLayoutWrapper>
      </ThemeProvider>
</NextAuthProvider>
</ReduxProvider>
      </body>
    </html>
  );
}
