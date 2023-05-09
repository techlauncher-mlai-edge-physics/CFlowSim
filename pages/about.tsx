import NavBar from "@components/NavBar";
import styles from "styles/Home.module.css";
import Head from "next/head";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import aboutContent from "../docs/about.md";
import remarkGfm from "remark-gfm";

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Head>
        <title>Physics in the Browser for the People</title>
        <meta name="description" content="PHYS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.navBar}>
          <NavBar />
        </div>
        <div className={styles.about}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
        </div>
      </main>
    </>
  );
}
