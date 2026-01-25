import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/protect", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => console.error(err));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
