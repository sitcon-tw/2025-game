import { useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const TokenContext = createContext<TokenContextType | null>(null);

type TokenContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string>>;
};

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useLocalStorage("token", "");
  return (
    <>
      <TokenContext.Provider value={{ token, setToken }}>
        {children}
      </TokenContext.Provider>
    </>
  );
}

export default function useToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const context = useContext(TokenContext);

  useEffect(() => {
    if (token?.length && token !== context?.token) {
      context?.setToken(token);
    }
  }, [context, token]);

  if (context === null) {
    throw new Error("useToken must be used within a TokenProvider");
  }

  return token ?? context.token;
}
