import { Prompt } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import React from "react"; // import React

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-prompt",
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
      <body className={`${prompt.variable} font-sans bg-gray-100`}>
        {children}
      </body>
    </html>
  );
}
