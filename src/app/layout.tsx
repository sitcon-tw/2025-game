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
              <div className="relative h-full w-full overflow-y-scroll">
                {children}
              </div>
              <div className="w-full">
                <footer className="flex border-t border-gray-700 bg-gray-200 bg-primary px-2 py-2 text-center text-sm text-primary-foreground">
                  <NavbarItem href="/game" name="遊戲" Icon={Gamepad} />
                  <NavbarItem href="/fragment" name="板塊" Icon={Blocks} />
                  <NavbarItem href="/store" name="商店" Icon={Store} />
                  <NavbarItem href="/personal" name="個人" Icon={UserRound} />
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
    <Link href={href} className="flex-1 px-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 px-3 py-1",
          isActive && "border-b-2 border-blue-200 text-blue-200",
        )}
      >
        <Icon strokeWidth={2} size={32} />
        {name}
      </div>
    </Link>
  );
}
