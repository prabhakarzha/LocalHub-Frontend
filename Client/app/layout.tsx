import "./globals.css";
import ScrollReset from "./components/ScrollReset";
import LayoutWrapper from "./components/LayoutWrapper";
import Providers from "@/redux/Providers";
import { Inter } from "next/font/google"; // ✅ Google Font import
import { Montserrat } from "next/font/google";

// ✅ Inter font initialize
// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "LocalHub",
  description: "Neighborhood Events & Services Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.className} h-full bg-gray-50`}>
      <body className="h-full w-full overflow-x-hidden bg-gray-50 text-gray-900">
        <Providers>
          <ScrollReset />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
