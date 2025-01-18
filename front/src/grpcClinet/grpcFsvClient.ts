import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {FService} from "../api/fs/v1/fs_connect";
import envUrls from "../const/baseurl";

export const FsvClient = createPromiseClient(
    FService,
    createConnectTransport({
        baseUrl: envUrls.FsvBaseUrl,
    }),
);
