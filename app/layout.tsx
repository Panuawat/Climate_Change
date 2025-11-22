import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import React from "react"; // import React

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
});

export const metadata = {
  title: "Climate Change Dashboard",
  description: "ดัชนีความพร้อมรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ",
};

// --- จุดที่ต้องแก้คือบรรทัดล่างนี้ครับ ---
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${ibmPlexSansThai.variable} font-sans bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}
