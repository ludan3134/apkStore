import {Server} from "../../../../api/tv_asm/v1/asm_pb";

export type ServerStore = {
    ServerEdit: Server;
    Serverlist: Server[];
    ServerFilter: Server;
    ServertableUrl: string;
};
