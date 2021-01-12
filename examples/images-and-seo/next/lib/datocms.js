import { GraphQLClient } from "graphql-request";

export function request({ query, variables, preview }) {
  const endpoint = preview
    ? `https://graphql.datocms.com/preview`
    : `https://graphql.datocms.com/`;

  const client = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964`
    }
  });

  return client.request(query, variables);
}