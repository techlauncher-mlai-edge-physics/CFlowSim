import css from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home(): React.ReactElement {
  const [paused, setPaused] = useState(true);
  const [worker, setWorker] = useState<Worker | null>(null);
  useEffect(() => {
    void (async () => {
      const worker = new Worker(
        new URL("../workers/modelWorker", import.meta.url),
        {
          type: "module",
        }
      );
      console.log("worker created", worker);
      worker.postMessage({ func: "init" });
      worker.onmessage = (e) => {
        if (e.data.type === "output") {
          const density = e.data.density;
          // log the array 64x64
          // chunk the array into 64x64
          const chunked = [];
          for (let i = 0; i < density.length; i += 64) {
            chunked.push(density.slice(i, i + 64));
          }
          console.log(chunked);
          // log some values
          console.log(
            "average density",
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            density.reduce((a: any, b: any) => a + b) / density.length
          );
          console.log("max density", Math.max(...density));
          console.log("min density", Math.min(...density));
          console.log(
            "density std dev",
            Math.sqrt(
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              density.reduce((a: any, b: any) => a + b * b) / density.length -
                Math.pow(
                  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  density.reduce((a: any, b: any) => a + b) / density.length,
                  2
                )
            )
          );
        } else console.log(e.data);
      };
      worker.onerror = (e) => {
        console.log(e);
      };
      setWorker(worker);
      console.log("worker created");
    })();
  }, []);

  return (
    // write a simple article to guide user to console
    <>
      <Head>
        <title>Model Verification</title>
        <meta name="description" content="Model Verification" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={css.main}>
        <h1 className={css.title}>Model Verification</h1>
        <p className={css.description}>
          This page is used to verify the model. See console for output.
        </p>
        <button
          onClick={() => {
            setPaused(!paused);
            if (paused && worker != null) {
              worker.postMessage({ func: "start" });
            } else if (!paused && worker != null) {
              worker.postMessage({ func: "pause" });
            } else {
              console.log("worker is null");
            }
          }}
          className={css.button}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </main>
    </>
  );
}
