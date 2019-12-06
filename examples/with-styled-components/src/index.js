import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { GlobalStyle } from "./styles";

const client = new GraphQLClient({
  url: "https://graphql-staging.datocms.com/",
  headers: {
    Authorization: "Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964"
  }
});

ReactDOM.render(
  <ClientContext.Provider value={client}>
    <GlobalStyle />
    <App />
  </ClientContext.Provider>,
  document.getElementById("root")
);
