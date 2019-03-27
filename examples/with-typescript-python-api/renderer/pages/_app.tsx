import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import electron from "electron";
import fetch from "isomorphic-fetch";
import App, { Container } from "next/app";
import React from "react";

let pyPort = 5000; // Actual port will be provided by main process
let appGlobalClient = null as ApolloClient<NormalizedCacheObject>;

const getAppGlobalClient = () => {
  return appGlobalClient;
}

if (electron && electron.ipcRenderer) {
  electron.ipcRenderer.on("pythonPort", ({}, arg) => {
    pyPort = arg;
    appGlobalClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        fetch:(fetch as any),
        uri: "http://127.0.0.1:" + pyPort + "/graphql/",
      }),
    });
  });
  electron.ipcRenderer.send("getPythonPort");
}

class MyApp extends App {
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export { getAppGlobalClient };
export default MyApp;
