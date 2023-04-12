import React from 'react';
import { createRoot } from 'react-dom/client';
import { Global } from "@emotion/core";
import { GraphQLClient, ClientContext } from "graphql-hooks";

import App from './App';
import { globalStyle } from "./styles";

const client = new GraphQLClient({
  url: "https://graphql.datocms.com/",
  headers: {
    Authorization: "Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964"
  }
});

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <ClientContext.Provider value={client}>
    <Global styles={globalStyle} />
    <App />
  </ClientContext.Provider>,
);