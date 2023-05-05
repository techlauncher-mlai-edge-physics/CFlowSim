import Head from "next/head";
// import { Inter } from "next/font/google";
import styles from "styles/Home.module.css";
import NavBar from "@components/NavBar";
import ParBar from "@components/ParametersBar";


export default function Home(): JSX.Element {
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
          <ParBar />
      </main>

    </>
  );
}
