'use client';

import {
  ChannelErrorData,
  ConnectionStatus,
  Options,
  UnsubscribeFn,
  subscribeToQuery,
} from 'datocms-listen';
import { useState } from 'react';
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';

export type SubscribeToQueryOptions<QueryResult, QueryVariables> = Omit<
  Options<QueryResult, QueryVariables>,
  'onStatusChange' | 'onUpdate' | 'onChannelError'
>;

export type EnabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled?: true;
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & SubscribeToQueryOptions<QueryResult, QueryVariables>;

export type DisabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled: false;
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & Partial<SubscribeToQueryOptions<QueryResult, QueryVariables>>;

export type QueryListenerOptions<QueryResult, QueryVariables> =
  | EnabledQueryListenerOptions<QueryResult, QueryVariables>
  | DisabledQueryListenerOptions<QueryResult, QueryVariables>;

export function useQuerySubscription<
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  QueryResult = any,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  QueryVariables = Record<string, any>,
>(options: QueryListenerOptions<QueryResult, QueryVariables>) {
  const { enabled, initialData, ...other } = options;

  const [error, setError] = useState<ChannelErrorData | null>(null);
  const [data, setData] = useState<QueryResult | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>(
    enabled ? 'connecting' : 'closed',
  );

  const subscribeToQueryOptions = other as EnabledQueryListenerOptions<
    QueryResult,
    QueryVariables
  >;

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
        ...subscribeToQueryOptions,
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
  }, [subscribeToQueryOptions]);

  return { error, status, data: data || initialData };
}
