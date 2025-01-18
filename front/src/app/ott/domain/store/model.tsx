import {Server} from "../../../../api/asm/v1/asm_pb";

export type ServerStore = {
    ServerEdit: Server;
    Serverlist: Server[];
    ServerFilter: Server;
    ServertableUrl: string;
};
