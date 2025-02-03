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
    <div className="relative h-full">
      <div className="w-full">{children}</div>
      <section className="absolute bottom-0 flex w-full gap-[2px]">
        <InnerBarItem href="/fragment/link" name="玩家連結" />
        <InnerBarItem href="/fragment/share" name="計畫共享" />
        <InnerBarItem href="/fragment/achievements" name="成就解鎖" />
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

  const isActive = pathname.includes(href);

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
