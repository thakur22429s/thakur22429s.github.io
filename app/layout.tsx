import "./globals.css";
import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";
import Reveals from "@/components/Reveals";

export const metadata: Metadata = {
  title: "Abhay Singh Thakur — AI/ML Engineer",
  description:
    "AI/ML engineer and Master's CS student at Rutgers — 3D perception research, shipped products, and a camera. SWE / ML roles.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="bg-layer" aria-hidden />
        <div className="grain-layer" aria-hidden />
        <CustomCursor />
        <Reveals />
        {children}
      </body>
    </html>
  );
}
