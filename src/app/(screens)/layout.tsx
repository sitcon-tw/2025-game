"use client";

import useToken from "@/hooks/useToken";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Notification {
  title: string;
  content: string;
  createdAt: string;
  id: string;
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const token = useToken();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      return fetch("/api/player/notify", {
        method: "POST",
        body: JSON.stringify({
          token,
        }),
      }).then((res) => res.json());
    },
    // TODO: 修改更好的間隔
    refetchInterval: 1000 * 10,
  });

  useEffect(() => {
    if (notifications) {
      setNotificationsQueue((queue) => [...queue, ...notifications]);
    }
  }, [notifications]);

  const [notificationsQueue, setNotificationsQueue] = useState<Notification[]>(
    [],
  );

  const notification = notificationsQueue[0];

  function popQueue() {
    setNotificationsQueue((queue) => queue.slice(1));
  }

  useEffect(() => {
    if (notification) {
      setDialogTitle(notification.title);
      setDialogContent(notification.content);
      if (notification.title && notification.content) setIsDialogOpen(true);
    }
  }, [notification]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDialogOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex w-2/3 flex-col items-center gap-2 rounded-lg bg-white p-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <div className="text-2xl font-bold">{dialogTitle}</div>
              <div className="text-lg">
                <p>{dialogContent}</p>
              </div>
              <button
                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white"
                onClick={() => {
                  setIsDialogOpen(false);
                  popQueue();
                }}
              >
                完成
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
