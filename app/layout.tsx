import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juu AI",
  description: "Real-time AI Teaching Platform",
  icons: {
    icon: [
      { url: "/images/juuailogo.png" },
      { url: "/images/juuailogo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/juuailogo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/juuailogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} antialiased`}>
        <ClerkProvider appearance={{ variables: { colorPrimary: '#fe5933' }} }>
          <Navbar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
