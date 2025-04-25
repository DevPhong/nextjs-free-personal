import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toast-custom";

const inter = Inter({ subsets: ["vietnamese"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
