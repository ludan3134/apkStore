import {ServerGroup} from "../../../../api/asm/tv_v1/asm_pb";

export type ServerGroupStore = {
    ServerGroupEdit: ServerGroup;
    ServerGrouplist: ServerGroup[];
    ServerGroupFilter: ServerGroup;
    ServerGrouptableUrl: string;
    serverList: any;
};
