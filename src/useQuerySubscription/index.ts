import { useState } from "react";
import {
  subscribeToQuery,
  UnsubscribeFn,
  ChannelErrorData,
  ConnectionStatus,
} from "../subscribeToQuery";
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from "use-deep-compare-effect";

type OptionalConfigurations<QueryResult, QueryVariables> = {
  /** GraphQL variables for the query */
  variables?: QueryVariables;
  /** If true, the Content Delivery API with draft content will be used */
  preview?: boolean;
  /** The name of the DatoCMS environment where to perform the query (defaults to primary environment) */
  environment?: string;
  /** The initial data to use on the first render  */
  initialData?: QueryResult | null;
  /** In case of network errors, the period to wait to reconnect */
  reconnectionPeriod?: number;
  /** The fetch function to use to perform the registration query */
  fetcher?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** The base URL to use to perform the query (defaults to `https://graphql-listen.datocms.com`) */
  baseUrl?: string;
};

type EnabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled?: true;
  /** The GraphQL query to subscribe */
  query: string;
  /** DatoCMS API token to use */
  token: string;
} & OptionalConfigurations<QueryResult, QueryVariables>;

type DisabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled: false;
  /** The GraphQL query to subscribe */
  query?: string;
  /** DatoCMS API token to use */
  token?: string;
} & OptionalConfigurations<QueryResult, QueryVariables>;

type QueryListenerOptions<QueryResult, QueryVariables> =
  | EnabledQueryListenerOptions<QueryResult, QueryVariables>
  | DisabledQueryListenerOptions<QueryResult, QueryVariables>;

export function useQuerySubscription<
  QueryResult = any,
  QueryVariables = Record<string, any>
>(options: QueryListenerOptions<QueryResult, QueryVariables>) {
  const { enabled, initialData } = options;

  const [error, setError] = useState<ChannelErrorData | null>(null);
  const [data, setData] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(
    enabled ? "connecting" : "closed"
  );

  const {
    preview,
    query,
    token,
    variables,
    environment,
    fetcher,
    reconnectionPeriod,
  } = options as EnabledQueryListenerOptions<QueryResult, QueryVariables>;

  useDeepCompareEffect(() => {
    if (enabled === false) {
      setStatus("closed");

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
  }, [
    preview,
    query,
    token,
    variables,
    environment,
    fetcher,
    reconnectionPeriod,
  ]);

  return { error, status, data: data || initialData };
}
