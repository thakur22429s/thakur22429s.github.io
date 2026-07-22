import "./globals.css";
import type { Metadata } from "next";
import { Caveat, Lora } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";

// Handwriting accent for storytelling bits (magic-ink line, eyebrows).
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--hand",
  weight: ["400", "600", "700"],
  display: "swap",
});

// Body copy — a warm, readable storytelling serif.
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  display: "swap",
});
import Reveals from "@/components/Reveals";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Abhay Singh Thakur — AI/ML Engineer",
  description:
    "AI/ML engineer and Master's CS student at Rutgers — 3D perception research, shipped products, and a camera. SWE / ML roles.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}",
          }}
        />
        <div className="bg-layer" aria-hidden />
        <div className="doodles" aria-hidden />
        <div className="grain-layer" aria-hidden />
        <CustomCursor />
        <Reveals />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
