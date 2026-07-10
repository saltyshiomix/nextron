import React from "react";
import Head from "next/head";
import Link from "next/link";
import Button from "@mui/material/Button";
import electron from "electron";
const ipcRenderer = electron.ipcRenderer || false;

function Home() {
  const handleClick = () => {
    if (ipcRenderer)
      ipcRenderer.send("loggerKey", {
        source: 1,
        code: 1,
        content: "Button pushed, hello there",
      });
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">
            <a>Go to next page</a>
          </Link>
        </p>
        <img src="/images/logo.png" />
        <Button variant="contained" color="secondary" onClick={handleClick}>
          Send logs from front to logger file
        </Button>
      </div>
    </React.Fragment>
  );
}

export default Home;
