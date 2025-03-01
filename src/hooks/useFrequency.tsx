import { useSearchParams } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useState } from "react";

const FrequencyContext = createContext<FrequencyContextType | null>(null);

type FrequencyContextType = {
  frequency: number;
  setFrequency: Dispatch<SetStateAction<number>>;
};

export default function FrequencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [frequency, setFrequency] = useState<number>(30);
  return (
    <>
      <FrequencyContext.Provider value={{ frequency, setFrequency }}>
        {children}
      </FrequencyContext.Provider>
    </>
  );
}
