import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {AService} from "../api/as/v1/as_connect";
import envUrls from "../const/baseurl";

export const AsvClient = createPromiseClient(
    AService,
    createConnectTransport({
        baseUrl: envUrls.AsvBaseUrl,
    }),
);
