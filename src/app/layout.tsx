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
  const pathname = usePathname();
  const enableScroll = pathname !== "/game";

  return (
    <html lang="zh-Hant-TW">
      <body className="flex h-screen flex-col overflow-hidden">
        <Suspense>
          <TokenProvider>
            <QueryClientProvider client={queryClient}>
              <div
                className={cn(
                  "relative h-full w-full pb-16",
                  enableScroll ? "overflow-y-scroll" : "overflow-hidden",
                )}
              >
                {children}
              </div>
              <div className="fixed bottom-0 w-full">
                <footer className="border-t border-gray-700/30 bg-primary/95 px-2 py-1 shadow-lg backdrop-blur-md">
                  <nav className="mx-auto flex max-w-md items-center justify-between">
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
          "mx-1 flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 transition-all duration-200 ease-in-out",
          isActive
            ? "scale-105 bg-primary-foreground/15 text-blue-200 shadow-md"
            : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-primary-foreground",
        )}
      >
        <Icon
          strokeWidth={isActive ? 2.5 : 1.8}
          size={28}
          className={cn(
            "transition-all",
            isActive && "drop-shadow-[0_0_3px_rgba(186,230,253,0.5)]",
          )}
        />
        <span
          className={cn("text-xs font-medium", isActive && "font-semibold")}
        >
          {name}
        </span>
      </div>
    </Link>
  );
}
