import type { Metadata } from "next";

import "./globals.css";
import Script from "next/script";

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
      <body>{children}        {/* Cloudflare Web Analytics */}
        <Script
          id="cloudflare-web-analytics"
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon='{"token":"1d4678fe95294c688ea7a2d36cd21708"}'
        />
      </body>
    </html>
  );
}
