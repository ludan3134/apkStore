import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {TVAService} from "../api/tv_as/v1/as_connect";
import envUrls from "../const/baseurl";

export const TVAsvClient = createPromiseClient(
    TVAService,
    createConnectTransport({
        baseUrl: envUrls.TVAsvBaseUrl,
    }),
);
