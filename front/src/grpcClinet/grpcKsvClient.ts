import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {KService} from "../api/ks/v1/ks_connect";
import envUrls from "../const/baseurl";

export const KsvClient = createPromiseClient(
    KService,
    createConnectTransport({
        baseUrl: envUrls.KsvBaseUrl,
    }),
);
