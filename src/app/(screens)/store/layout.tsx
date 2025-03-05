"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Gift, Ticket } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-col">
      <motion.section
        className="flex w-full border-b border-gray-700/30 bg-primary/90 backdrop-blur-md shadow-md"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <InnerBarItem href="/store" name="點數兌換" />
        <InnerBarItem href="/store/my-tickets" name="我的票券" />
      </motion.section>
      <div className="w-full flex-1 overflow-y-scroll">{children}</div>
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

  const getIcon = () => {
    switch (name) {
      case "點數兌換":
        return <Gift className="mr-2 h-5 w-5" />;
      case "我的票券":
        return <Ticket className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-1 items-center justify-center py-3 px-4 transition-all duration-200 ease-in-out",
        isActive
          ? "bg-primary-foreground/15 text-blue-200 font-medium"
          : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
      )}
    >
      {isActive && (
        <motion.div
          className="absolute -bottom-[2px] left-0 right-0 flex justify-center"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-[2px] w-16 bg-blue-200 rounded-full shadow-[0_0_4px_rgba(186,230,253,0.7)]"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </motion.div>
      )}
      <motion.span
        className={cn("transition-all flex items-center", isActive && "font-medium")}
        initial={{ scale: 1 }}
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {getIcon()}
        {name}
      </motion.span>
    </Link>
  );
}
