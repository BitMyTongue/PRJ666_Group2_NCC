import { createContext, useEffect, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [totalHistory, setTotalHistory] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const addToHistory = (str) => {
    if (!totalHistory) return;
    if (totalHistory.includes(str)) return;
    setTotalHistory([str].concat(totalHistory));
  };

  const removeFromHistory = (str) => {
    if (!totalHistory) return;
    if (!totalHistory.includes(str)) return;
    const idx = totalHistory.findIndex((v) => v === str);
    totalHistory.splice(idx, 1);
    setTotalHistory([...totalHistory]);
  };

  useEffect(() => {
    const effectAsync = () => {
      const hisString = localStorage.getItem("history");
      setTotalHistory(JSON.parse(hisString) ?? []);
    };
    effectAsync();
  }, []);
  useEffect(() => {
    if (!totalHistory) return;
    const effectAsync = () => {
      localStorage.setItem("history", JSON.stringify(totalHistory));
      setHistory(totalHistory.slice(0, 4));
    };
    effectAsync();
  }, [totalHistory]);

  return (
    <SearchContext.Provider
      value={{
        history,
        addToHistory,
        removeFromHistory,
        searchItem,
        setSearchItem,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
