import { Inter } from "next/font/google";
import "./lib/ui/globals.css";
import { WalletProvider } from "./modules/wallet/services/context";
import { NextAuthProvider } from "./components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <WalletProvider>{children}</WalletProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
