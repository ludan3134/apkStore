import {AppUser} from "../../../../api/ws/v1/wm_pb";

export type AppUserStore = {
    AppUserEdit: AppUser;
    AppUserList: AppUser[];
    AppUserUrl: string;
    AppUserFilter: AppUser;
};
export type AppUserBulkImport = {
    distributor_id: string;
    model_id: string;
    fun: string;
};
