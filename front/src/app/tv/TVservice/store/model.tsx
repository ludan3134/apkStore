import {PortalInfo} from "../../../../api/tv_asm/v1/asm_pb";

export type PortalInfoStore = {
    PortalInfoEdit: PortalInfo;
    PortalInfolist: PortalInfo[];
    PortalInfoFilter: PortalInfo;
    PortalInfotableUrl: string;
};
