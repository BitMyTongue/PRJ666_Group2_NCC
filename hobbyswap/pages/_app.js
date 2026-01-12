import Layout from "@/components/layout";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/main.css";
import "@/styles/custom.css";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
