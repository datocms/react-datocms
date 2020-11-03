import { useState } from "react";
import {
  subscribeToQuery,
  UnsubscribeFn,
  ChannelErrorData,
  ConnectionStatus,
} from "../subscribeToQuery";
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from "use-deep-compare-effect";

type QueryListenerOptions<QueryResult, QueryVariables> = {
  /** The GraphQL query to subscribe */
  query: string;
  /** GraphQL variables for the query */
  variables?: QueryVariables;
  /** DatoCMS API token to use */
  token: string;
  /** If true, the Content Delivery API with draft content will be used */
  preview?: boolean;
  /** The name of the DatoCMS environment where to perform the query (defaults to primary environment) */
  environment?: string;
  /** The initial data to use on the first render  */
  initialData?: QueryResult | null;
  /** Whether the subscription has to be performed or not */
  enabled?: boolean;
  /** In case of network errors, the period to wait to reconnect */
  reconnectionPeriod?: number;
  /** The fetch function to use to perform the registration query */
  fetcher?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** The base URL to use to perform the query (defaults to `https://graphql-listen.datocms.com`) */
  baseUrl?: string;
};

export function useQuerySubscription<
  QueryResult = any,
  QueryVariables = Record<string, any>
>(options: QueryListenerOptions<QueryResult, QueryVariables>) {
  const {
    initialData,
    enabled,
    preview,
    query,
    token,
    variables,
    environment,
    fetcher,
    reconnectionPeriod,
  } = options;

  const [error, setError] = useState<ChannelErrorData | null>(null);
  const [data, setData] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(enabled ? "connecting" : "closed");

  useDeepCompareEffect(() => {
    if (enabled === false) {
      setStatus('closed');

      return () => {
        // we don't have to perform any uninstall
      };
    }

    let unsubscribe: UnsubscribeFn | null;

    async function subscribe() {
      unsubscribe = await subscribeToQuery<QueryResult, QueryVariables>({
        preview,
        query,
        token,
        variables,
        environment,
        fetcher,
        reconnectionPeriod: reconnectionPeriod,
        onStatusChange: (status) => {
          setStatus(status);
        },
        onUpdate: (updateData) => {
          setError(null);
          setData(updateData.response.data);
        },
        onChannelError: (errorData) => {
          setData(null);
          setError(errorData);
        },
      });
    }

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [preview, query, token, variables, environment]);

  return { error, status, data: data || initialData };
}
