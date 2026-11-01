import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource-variable/instrument-sans/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pill: the Dynamic Island for Windows",
  description:
    "Pill is a free, open source Dynamic Island for Windows. Music, timers, notifications and system events in one pill at the top of your screen, with real spring physics.",
  openGraph: {
    title: "Pill: the Dynamic Island for Windows",
    description:
      "One pill at the top of your screen for music, timers, notifications and system events. Free and open source.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
