import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { CurrencyProvider } from "../context/CurrencyContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DevHider from "../components/DevHider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Amal E-Commerce",
  description: "Produits naturels, céréales et encens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className} suppressHydrationWarning={true}>
        <CurrencyProvider>
          <CartProvider>
            <DevHider />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
