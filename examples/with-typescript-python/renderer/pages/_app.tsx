import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-fetch";
import App, { Container } from "next/app";
import React from "react";

// const isServer = (typeof window === "undefined"); // tslint:disable-line

const appGlobalClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    fetch:(fetch as any),
    uri: "http://127.0.0.1:5000/graphql/",
  }),
});

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

export { appGlobalClient };
export default MyApp;
