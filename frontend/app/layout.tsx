import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import "./globals.css";


export const metadata: Metadata = {
  title: "SteamInsights",
  description: "Steam game analytics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
