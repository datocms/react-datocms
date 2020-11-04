export type UpdateData<QueryResult> = {
  /** The raw GraphQL response */
  response: {
    /** GraphQL response `data` property */
    data: QueryResult;
  };
};

export type ChannelErrorData = {
  /** The code of the error (ie. `INVALID_QUERY`) */
  code: string;
  /** An human friendly message explaining the error */
  message: string;
  /** If the error is not fatal (ie. the query is invalid), the query will be retried after some time */
  fatal: boolean;
  /** The raw error response, if available */
  response?: any;
};

type EndpointFactoryOptions = {
  baseUrl: string;
  preview?: boolean;
  environment?: string;
};

function endpointFactory({
  baseUrl,
  preview,
  environment,
}: EndpointFactoryOptions) {
  let result = baseUrl;

  if (environment) {
    result += `/environments/${environment}`;
  }

  if (preview) {
    result += `/preview`;
  }

  return result;
}

export type ConnectionStatus = "connecting" | "connected" | "closed";

export type Options<QueryResult, QueryVariables> = {
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
  /** In case of network errors, the period to wait to reconnect */
  reconnectionPeriod?: number;
  /** The fetch function to use to perform the registration query */
  fetcher?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  /** The base URL to use to perform the query (defaults to `https://graphql-listen.datocms.com`) */
  baseUrl?: string;
  /** Callback function to call on status change */
  onStatusChange: (status: ConnectionStatus) => void;
  /** Callback function to call on query result updates */
  onUpdate: (updateData: UpdateData<QueryResult>) => void;
  /** Callback function to call on errors */
  onChannelError: (updateData: ChannelErrorData) => void;
};

export type UnsubscribeFn = () => void;

export async function subscribeToQuery<
  QueryResult = any,
  QueryVariables = Record<string, any>
>(options: Options<QueryResult, QueryVariables>): Promise<UnsubscribeFn> {
  const {
    query,
    token,
    variables,
    preview,
    environment,
    fetcher: customFetcher,
    onStatusChange,
    onUpdate,
    onChannelError,
    reconnectionPeriod: customReconnectionPeriod,
    baseUrl: customBaseUrl,
  } = options;

  const fetcher = customFetcher || window.fetch;
  const reconnectionPeriod = customReconnectionPeriod || 1000;
  const baseUrl = customBaseUrl || "https://graphql-listen.datocms.com";

  const waitAndReconnect = async () => {
    await new Promise((resolve) => setTimeout(resolve, reconnectionPeriod));
    return subscribeToQuery({
      ...options,
      reconnectionPeriod:
        (options.reconnectionPeriod || 1000) + reconnectionPeriod,
    });
  };

  let registrationId: string;

  onStatusChange("connecting");

  try {
    const req = await fetcher(
      endpointFactory({ baseUrl, preview, environment }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: `application/json`,
        },
        method: "POST",
        body: JSON.stringify({ query, variables }),
      }
    );

    if (req.status !== 200) {
      throw new Error("Invalid response code");
    }

    if (req.headers.get("Content-Type") !== "application/json") {
      throw new Error("Invalid content type");
    }

    const registration = await req.json();

    registrationId = registration.id;
  } catch (e) {
    return waitAndReconnect();
  }

  return new Promise((resolve) => {
    const eventSource = new EventSource(`${baseUrl}/events/${registrationId}`);
    let stopReconnecting = false;

    const unsubscribe = () => {
      if (eventSource.readyState !== 2) {
        eventSource.close();
      }
    };

    eventSource.addEventListener("open", () => {
      onStatusChange("connected");
      resolve(unsubscribe);
    });

    eventSource.addEventListener("update", (event) => {
      const updateData = JSON.parse((event as any).data) as UpdateData<
        QueryResult
      >;
      onUpdate(updateData);
    });

    eventSource.addEventListener("channelError", (event) => {
      const errorData = JSON.parse((event as any).data) as ChannelErrorData;

      if (errorData.fatal) {
        onStatusChange("closed");
        stopReconnecting = true;
        unsubscribe();
      }

      onChannelError(errorData);
    });

    eventSource.onerror = async () => {
      eventSource.close();

      if (!stopReconnecting) {
        waitAndReconnect();
      }
    };
  });
}
