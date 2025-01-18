import {proxy} from "valtio";
import {useProxy} from "valtio/utils";

export const IsUploadFileReset = proxy({IsReset: false});

export const useproxy_IsUploadFileReset = () => {
    var IsUploadFileResetProxy = useProxy(IsUploadFileReset);
    return IsUploadFileResetProxy.IsReset;
};
