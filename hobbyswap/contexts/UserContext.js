import { createContext, useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    const client = StreamChat.getInstance(
      process.env.NEXT_PUBLIC_STREAM_CHAT_KEY,
    );
    await client.disconnectUser();
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // setLoading(false);
      return;
    }

    fetch("/api/auth/protect", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token invalid");

        console.log("Token valid, response status:", res);
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(logout)
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
