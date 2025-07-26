import "./globals.css";
import ScrollReset from "./components/ScrollReset";
import LayoutWrapper from "./components/LayoutWrapper";
import Providers from "@/redux/Providers";

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
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Providers>
          <ScrollReset />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
