import type { Metadata } from "next";
import { AppProvider } from "@/components/providers/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "D'trax · Company Profile",
  description: "D'trax Design company profile deck",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
