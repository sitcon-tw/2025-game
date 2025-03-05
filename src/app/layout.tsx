"use client";

import "./globals.css";
import Link from "next/link";
import { Blocks, Gamepad, LucideIcon, Store, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TokenProvider } from "@/hooks/useToken";
import { Suspense } from "react";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW">
      <body className="flex h-screen flex-col overflow-hidden">
        <Suspense>
          <TokenProvider>
            <QueryClientProvider client={queryClient}>
              <div className="relative h-full w-full overflow-y-scroll pb-16">
                {children}
              </div>
              <div className="fixed bottom-0 w-full">
                <footer className="backdrop-blur-md border-t border-gray-700/30 bg-primary/95 px-2 py-1 shadow-lg">
                  <nav className="flex max-w-md mx-auto justify-between items-center">
                    <NavbarItem href="/game" name="遊戲" Icon={Gamepad} />
                    <NavbarItem href="/fragment" name="板塊" Icon={Blocks} />
                    <NavbarItem href="/store" name="商店" Icon={Store} />
                    <NavbarItem href="/personal" name="個人" Icon={UserRound} />
                  </nav>
                </footer>
              </div>
            </QueryClientProvider>
          </TokenProvider>
        </Suspense>
      </body>
    </html>
  );
}

function NavbarItem({
  href,
  name,
  Icon,
}: Readonly<{ href: string; name: string; Icon: LucideIcon }>) {
  const pathname = usePathname();
  const getIsActive = () => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.includes(href);
  };
  const isActive = getIsActive();

  return (
    <Link href={href} className="flex-1">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 py-2 px-4 transition-all duration-200 ease-in-out rounded-lg mx-1",
          isActive
            ? "bg-primary-foreground/15 text-blue-200 scale-105 shadow-md"
            : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
        )}
      >
        <Icon
          strokeWidth={isActive ? 2.5 : 1.8}
          size={28}
          className={cn(
            "transition-all",
            isActive && "drop-shadow-[0_0_3px_rgba(186,230,253,0.5)]"
          )}
        />
        <span className={cn(
          "text-xs font-medium",
          isActive && "font-semibold"
        )}>
          {name}
        </span>
      </div>
    </Link>
  );
}
