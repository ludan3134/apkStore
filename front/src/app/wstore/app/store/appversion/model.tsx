import {AppVersion} from "../../../../../api/ws/v1/wm_pb";

export type AppVersionStore = {
    AppVersionEdit: AppVersion;
    AppVersionList: AppVersion[];
    IsAppsFileUpload: boolean;
    AppsversiontableUrl: string;
    classX: string;
};
