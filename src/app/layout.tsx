import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SQLTrain",
  description: "Practice SQL in an interactive browser-based training environment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
