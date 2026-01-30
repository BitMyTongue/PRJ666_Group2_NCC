import Layout from "@/components/layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/main.css";
import "@/styles/custom.css";
import "stream-chat-react/dist/css/v2/index.css";
import "@/styles/chat.css";
import { UserProvider } from "@/contexts/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
