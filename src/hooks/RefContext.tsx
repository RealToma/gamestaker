import { useState } from "react";
import { createContext } from "react";

export const RefContext = createContext(null);

export default function RefContextProvider({ children }: any) {
  const [arrayMyBets, setArrayMyBets] = useState([]);

  return (
    <RefContext.Provider
      value={
        {
          arrayMyBets,
          setArrayMyBets,
        } as any
      }
    >
      {children}
    </RefContext.Provider>
  );
}
