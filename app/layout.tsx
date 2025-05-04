import { ReactNode } from "react";
import ClientProviders from "./Providers/ClientProvider";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { Toaster } from "sonner";
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <div>
            <Toaster />
            </div>
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
