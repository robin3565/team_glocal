import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const noto = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "글로컬 공책",
  description: "팀 일정과 사다리 기록을 남기는 공책",
  applicationName: "글로컬 공책",
  appleWebApp: {
    capable: true,
    title: "글로컬",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#efe7d6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${noto.variable} h-dvh antialiased`}>
      <body className="flex h-dvh justify-center overflow-hidden bg-[#d7cdb8]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
