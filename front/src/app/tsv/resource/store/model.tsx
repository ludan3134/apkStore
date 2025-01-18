import {DownloadConfig} from "../../../../api/ta/v1/tam_pb";

export type ResourceStore = {
    ResourceEdit: DownloadConfig;
    Resourcelist: DownloadConfig[];
    ResourceFilter: DownloadConfig;
    ResourcetableUrl: string;
};
