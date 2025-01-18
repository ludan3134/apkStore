import {createPromiseClient} from "@connectrpc/connect";
import {createConnectTransport} from "@connectrpc/connect-web";
import {TVFService} from "../api/tv_fs/v1/fs_connect";
import envUrls from "../const/baseurl";

export const TVFsvClient = createPromiseClient(
    TVFService,
    createConnectTransport({
        baseUrl: envUrls.TVFsvBaseUrl,
    }),
);
