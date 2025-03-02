"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQRCode } from "next-qrcode";

export default function CouponCodeDialog({
  isOpen,
  setIsOpen,
  couponId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  couponId: string;
}) {
  const { Canvas } = useQRCode();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{ pointerEvents: "auto" }}
          className="fixed inset-0 z-50 m-0 flex items-center justify-center bg-black/60 text-foreground"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 10, filter: "blur(0.35em)" }}
            animate={{ scale: 0.9, opacity: 1, y: 0, filter: "blur(0)" }}
            exit={{ scale: 0.8, opacity: 0, y: 10, filter: "blur(0.3em)" }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[55%] w-[90%] flex-col items-center rounded-lg bg-background p-8 md:static md:max-w-[70%] md:justify-start lg:max-w-[60%]"
          >
            <div className="mb-5 flex w-full flex-row items-center text-start text-3xl font-bold text-foreground">
              <TicketPercent size={48} className="mr-2 text-foreground" />
              <span>折價卷</span>
              <Button
                variant="ghost"
                className="ml-auto w-10 [&_svg]:size-10"
                onClick={() => setIsOpen(false)}
              >
                <X size={32} />
              </Button>
            </div>
            <Canvas
              text={couponId}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#4B5563FF",
                  light: "#E5E7EBFF",
                },
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
