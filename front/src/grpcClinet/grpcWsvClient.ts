import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {WService} from "../api/ws/v1/ws_connect";
import envUrls from "../const/baseurl";

export const WsvClient = createPromiseClient(
    WService,
    createConnectTransport({
        baseUrl: envUrls.WsvBaseUrl,
    }),
);
