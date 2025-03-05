"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full flex-1 overflow-y-scroll">{children}</div>
      <section className="flex w-full gap-[2px]">
        <InnerBarItem href="/store" name="點數兌換" />
        <InnerBarItem href="/store/my-tickets" name="我的票卷" />
      </section>
    </div>
  );
}

function InnerBarItem({
  href,
  name,
}: Readonly<{
  href: string;
  name: string;
}>) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className="relative flex w-full flex-1 justify-center bg-[#4b5c6bff] py-2 text-white"
    >
      {isActive && (
        <svg
          className="absolute -top-[10px]"
          width="20"
          height="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="10,0 20,10 0,10 20,12 0,12" fill="#4b5c6bff" />
        </svg>
      )}
      {name}
    </Link>
  );
}
