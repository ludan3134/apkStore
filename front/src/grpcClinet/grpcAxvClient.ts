import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {AXService} from "../api/ax/v1/ax_connect";
import envUrls from "../const/baseurl";

export const AxvClient = createPromiseClient(
    AXService,
    createConnectTransport({
        baseUrl: envUrls.AXVBaseUrl,
    }),
);
