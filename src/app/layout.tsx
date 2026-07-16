import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SQLTrain",
    template: "%s | SQLTrain",
  },
  description:
    "Practice SQL safely with SQLite and your own Excel or CSV data directly in your browser.",
  applicationName: "SQLTrain",
  authors: [
    {
      name: "Eige90",
      url: "https://github.com/Eige90",
    },
  ],
  keywords: [
    "SQL",
    "SQLite",
    "SQL training",
    "SQL playground",
    "Excel import",
    "CSV import",
    "WebAssembly",
  ],
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
