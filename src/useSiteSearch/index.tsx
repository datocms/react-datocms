'use client';

import React, { useCallback, useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';

type SearchResultInstancesHrefSchema = {
  page?: {
    offset?: number;
    limit?: number;
    [k: string]: unknown;
  };
  filter: {
    fuzzy?: boolean;
    query: string;
    build_trigger_id?: string;
    locale?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

type SearchResultInstancesTargetSchema = {
  data: RawSearchResult[];
  meta: {
    total_count: number;
  };
};

export type RawSearchResult = {
  type: 'search_result';
  id: string;
  attributes: {
    title: string;
    body_excerpt: string;
    url: string;
    score: number;
    highlight: {
      title?: string[] | null;
      body?: string[] | null;
    };
  };
};

declare class GenericClient {
  config: {
    apiToken: string | null;
  };
  searchResults: {
    rawList(
      queryParams: SearchResultInstancesHrefSchema,
    ): Promise<SearchResultInstancesTargetSchema>;
  };
}

type Highlighter = (
  match: string,
  key: string,
  context: 'title' | 'bodyExcerpt',
) => React.ReactNode;

export type UseSiteSearchConfig<Client extends GenericClient> = {
  client: Client;
  buildTriggerId: string;
  fuzzySearch?: boolean;
  resultsPerPage?: number;
  highlightMatch?: Highlighter;
  initialState?: {
    locale?: string;
    page?: number;
    query?: string;
  };
};

type SearchResult = {
  id: string;
  title: React.ReactNode;
  bodyExcerpt: React.ReactNode;
  url: string;
  raw: RawSearchResult;
};

export type UseSiteSearchData = {
  pageResults: SearchResult[];
  totalResults: number;
  totalPages: number;
};

export type UseSiteSearchResult = {
  state: {
    query: string;
    setQuery: (newQuery: string) => void;
    locale: string | undefined;
    setLocale: (newLocale: string) => void;
    page: number;
    setPage: (newPage: number) => void;
  };
  data?: UseSiteSearchData;
  error?: string;
};

const defaultHighlighter: Highlighter = (text, key) => (
  <mark key={key}>{text}</mark>
);

function MatchHighlighter({
  children,
  highlighter,
  context,
}: {
  children: string;
  highlighter: Highlighter;
  context: 'title' | 'bodyExcerpt';
}) {
  return (
    <>
      {reactStringReplace(children, /\[h\](.+?)\[\/h\]/g, (match, index) =>
        highlighter(match, index.toString(), context),
      )}
    </>
  );
}

export function useSiteSearch<Client extends GenericClient>(
  config: UseSiteSearchConfig<Client>,
): UseSiteSearchResult {
  const [state, setState] = useState<{
    query: string;
    page: number;
    locale: string | undefined;
  }>({
    query: config.initialState?.query || '',
    page: config.initialState?.page || 0,
    locale: config.initialState?.locale,
  });

  const [error, setError] = useState<string | undefined>();
  const [response, setResponse] = useState<
    SearchResultInstancesTargetSchema | undefined
  >();

  const resultsPerPage = config.resultsPerPage || 8;

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      try {
        setError(undefined);

        if (!state.query) {
          setResponse({ data: [], meta: { total_count: 0 } });
          return;
        }

        setResponse(undefined);

        const request: SearchResultInstancesHrefSchema = {
          filter: {
            query: state.query,
            locale: state.locale,
            build_trigger_id: config.buildTriggerId,
          },
          page: {
            limit: resultsPerPage,
            offset: resultsPerPage * state.page,
          },
        };

        if (config.fuzzySearch) {
          request.fuzzy = 'true';
        }

        const response = await config.client.searchResults.rawList(request);

        if (!isCancelled) {
          setResponse(response);
        }
      } catch (e) {
        if (isCancelled) {
          return;
        }

        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('Unknown error!');
        }
      }
    };

    run();

    return () => {
      isCancelled = true;
    };
  }, [
    resultsPerPage,
    state,
    config.buildTriggerId,
    config.fuzzySearch,
    config.client.config.apiToken,
  ]);

  const publicSetQuery = useCallback(
    (newQuery: string) => {
      setState((oldState) => ({ ...oldState, query: newQuery, page: 0 }));
    },
    [setState],
  );

  const publicSetPage = useCallback(
    (newPage: number) => {
      setState((oldState) => ({ ...oldState, page: newPage }));
    },
    [setState],
  );

  const publicSetLocale = useCallback(
    (newLocale: string | undefined) => {
      setState((oldState) => ({ ...oldState, locale: newLocale, page: 0 }));
    },
    [setState],
  );

  const highlighter = config.highlightMatch || defaultHighlighter;

  return {
    state: {
      query: state.query,
      setQuery: publicSetQuery,
      page: state.page,
      setPage: publicSetPage,
      locale: state.locale,
      setLocale: publicSetLocale,
    },

    error,
    data:
      state.query === ''
        ? {
            pageResults: [],
            totalResults: 0,
            totalPages: 0,
          }
        : response
          ? {
              pageResults: response.data.map((rawSearchResult) => ({
                id: rawSearchResult.id,
                url: rawSearchResult.attributes.url,
                title: rawSearchResult.attributes.highlight.title ? (
                  <MatchHighlighter highlighter={highlighter} context="title">
                    {rawSearchResult.attributes.highlight.title[0]}
                  </MatchHighlighter>
                ) : (
                  rawSearchResult.attributes.title
                ),
                bodyExcerpt: rawSearchResult.attributes.highlight.body ? (
                  <MatchHighlighter
                    highlighter={highlighter}
                    context="bodyExcerpt"
                  >
                    {rawSearchResult.attributes.highlight.body[0]}
                  </MatchHighlighter>
                ) : (
                  rawSearchResult.attributes.body_excerpt
                ),
                raw: rawSearchResult,
              })),
              totalResults: response.meta.total_count,
              totalPages: Math.ceil(response.meta.total_count / resultsPerPage),
            }
          : undefined,
  };
}
