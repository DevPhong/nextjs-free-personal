import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toast-custom";
import AppProvider from "@/app/AppProvider";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["vietnamese"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider inititalSessionToken={sessionToken?.value}>
            <Header />
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
