import { useState, useEffect } from "react";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={` min-h-screen p-8`}>
      <h1 className="text-2xl font-bold mb-6">Admin Users</h1>

      <h1>this is something</h1>
    </div>
  );
}
