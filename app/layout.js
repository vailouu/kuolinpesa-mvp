import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import BackgroundGlow from "./components/BackgroundGlow";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Pesänhoitaja",
  description: "Kuolinpesän hallinta",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} antialiased`}>
        <BackgroundGlow />
        {children}
      </body>
    </html>
  );
}