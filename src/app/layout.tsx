import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "../globals.css";
import Navbar from "../component/navbar";
import Footer from "@/component/footer";
import { ToastProvider } from "@/components/Toast";
import DocumentAttributes from "@/components/DocumentAttributes";
import Breadcrumb from "@/components/Breadcrumb";
import RouteProgressBar from "@/components/RouteProgressBar";
import WhatsAppButton from "./components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Anwar ul-Uloom al-Islamiyyah - Islamic Learning Platform",
  description: "Discover authentic Islamic teachings, connect with scholars, and strengthen your faith",
  generator: "Next.js",
  verification: {
    google: "xHlujaXdwIQvRWIiCX6Yw12-P1Ol7iekJvWcGdFKEZM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-scroll-behavior="smooth" dir="rtl" lang="ps">
      <body suppressHydrationWarning>

        <ToastProvider>
          <DocumentAttributes />
          <Suspense fallback={null}>
            <RouteProgressBar />
          </Suspense>
          <Navbar />
          <main>
            <Breadcrumb />
            {children}
          </main>
          <Footer/>
          <WhatsAppButton />
        </ToastProvider>
      </body>
    </html>
  );
}
