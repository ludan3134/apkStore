import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {TAService} from "../api/ta/v1/tas_connect";
import envUrls from "../const/baseurl";

export const TsvClient = createPromiseClient(
    TAService,
    createConnectTransport({
        baseUrl: envUrls.TsvBaseUrl,
    }),
);
