import { AnimatePresence, motion } from "framer-motion";
import { TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CouponCodeDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
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
            className="flex h-[50%] w-[90%] flex-col items-center rounded-lg bg-background p-8 md:static md:max-w-[70%] md:justify-start lg:max-w-[60%]"
          >
            <div className="mb-5 flex w-full flex-row items-center text-start text-3xl font-bold text-primary">
              <TicketPercent size={48} className="mr-2 text-primary" />
              <span>折價卷</span>
              <Button
                variant="ghost"
                className="ml-auto w-10 [&_svg]:size-10"
                onClick={() => setIsOpen(false)}
              >
                <X size={32} />
              </Button>
            </div>
            TODO: 接 API 之後弄w
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
