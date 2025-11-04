import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhotoSelect AI - Intelligent Photo Dashboard",
  description: "Automatically identify and display the best photos from your shoots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
