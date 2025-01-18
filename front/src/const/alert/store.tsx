import {useProxy} from "valtio/utils";
import {proxy} from "valtio";

export type DialogStore = {
    title: string;
    content: string;
    IsOpen: boolean;
};
export const IsOpenDialog = proxy<DialogStore>({
    title: "",
    IsOpen: false,
    content: "",
});

export const useproxy_IsOpenDialog = () => {
    var IsOpenDialogProxy = useProxy(IsOpenDialog);
    return IsOpenDialogProxy.IsOpen;
};
export const useproxy_IsOpenDialogContent = () => {
    var IsOpenDialogProxy = useProxy(IsOpenDialog);
    return IsOpenDialogProxy.content;
};
export const useproxy_IsOpenDialogTitle = () => {
    var IsOpenDialogProxy = useProxy(IsOpenDialog);
    return IsOpenDialogProxy.title;
};

export type ConfirmStore = {
    title: string;
    content: string;
    IsOpen: boolean;
    refleshPage: boolean;
};
export const IsConfirmDialog = proxy<ConfirmStore>({
    title: "",
    IsOpen: false,
    content: "",
    refleshPage: false,
});

export const useproxy_IsConfirmDialogIsOpen = () => {
    var IsConfirmDialogProxy = useProxy(IsConfirmDialog);
    return IsConfirmDialogProxy.IsOpen;
};

export const useproxy_IsConfirmDialogContent = () => {
    var IsConfirmDialogProxy = useProxy(IsConfirmDialog);
    return IsConfirmDialogProxy.content;
};
export const useproxy_IsConfirmDialogTitle = () => {
    var IsConfirmDialogProxy = useProxy(IsConfirmDialog);
    return IsConfirmDialogProxy.title;
};

export const useproxy_IsConfirmDialogRefleshPage = () => {
    var IsConfirmDialogProxy = useProxy(IsConfirmDialog);
    return IsConfirmDialogProxy.refleshPage;
};
// 返回上一级
