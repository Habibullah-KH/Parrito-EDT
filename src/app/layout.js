import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import { ThemeProvider } from "./components/Theme/useTheme";
import "./globals.css";
import NextAuthProvider from "@/Providers/NextAuthProvider";

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
<NextAuthProvider>
     <ToastContainer />
      <ThemeProvider>
      <NavBar/>
      <div className="min-h-[calc(100dvh-300px)]">
        {children}
      </div>
      <div id="footer">
      <Footer/>
      </div>
      </ThemeProvider>
</NextAuthProvider>
      </body>
    </html>
  );
}
