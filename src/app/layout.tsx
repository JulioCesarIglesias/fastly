import "./globals.css";

import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

// import { ThemeProvider } from "@/app/(protected)/_components/theme-provider";
import { ReactQueryProvider } from "@/providers/react-query";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Festly | Sistema de Gestão para eventos",
  description:
    "Festly é a solução completa para gestão de eventos. Controle convidados, confirmações de presença e muito mais em uma única plataforma intuitiva.",
  icons: {
    icon: "/Logo-min.svg",
  },
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>
        {/* </ThemeProvider> */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
