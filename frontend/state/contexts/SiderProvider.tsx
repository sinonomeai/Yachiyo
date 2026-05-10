import { createContext, useState, useContext, ReactNode } from "react";
interface SiderContextType {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
export const SiderContext = createContext<SiderContextType | undefined>(undefined);



export const SiderProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <SiderContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </SiderContext.Provider>
  );
};
