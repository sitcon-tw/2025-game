"use client";

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

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

const TokenContext = createContext<TokenContextType | null>(null);

type TokenContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string>>;
};

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  if (!isClient) {
    return <TokenContext.Provider value={ null}>
    {children}
  </TokenContext.Provider>;
  }

  return (
    <>
      <TokenProviderClient>{children}</TokenProviderClient>
    </>
  );
}

function TokenProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return token ?? context?.token ?? null;
}
