import { createContext, useEffect, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const addToHistory = (str) => {
    if (!history) return;
    if (history.includes(str)) return;
    if (history.length > 3) history.pop();
    setHistory([str].concat(history));
  };

  useEffect(() => {
    const effectAsync = () => {
      const hisString = localStorage.getItem("history");
      setHistory(JSON.parse(hisString) ?? []);
    };
    effectAsync();
  }, []);
  useEffect(() => {
    if (!history || history.length === 0) return;
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  return (
    <SearchContext.Provider
      value={{ history, addToHistory, searchItem, setSearchItem }}
    >
      {children}
    </SearchContext.Provider>
  );
};
