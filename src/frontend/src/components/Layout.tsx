import type React from "react";
import TopNav from "./TopNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-card py-4 px-6 text-center text-sm text-muted-foreground">
        <p>
          Built with <span className="text-red-500">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "sarthi-app")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-teal hover:underline"
          >
            caffeine.ai
          </a>{" "}
          · © {new Date().getFullYear()} Sarthi
        </p>
      </footer>
    </div>
  );
}
