import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { SettingsProvider } from "@/components/SettingsProvider";

export const metadata: Metadata = {
  title: "YoungFinners",
  description: "Student startup incubation and micro-crowdfunding, managed by Zaro AI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="pitch-black" data-density="comfortable" data-anim="subtle">
      <body className="flex min-h-screen">
        <SettingsProvider>
          <Nav />
          <main className="flex-1 space-y-4 p-6">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  );
}
