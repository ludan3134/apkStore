import {ServerConfig} from "../../../api/ax/v1/axm_pb";

export type ServerConfigStore = {
    ServerConfigEdit: ServerConfig;
    ServerConfiglist: ServerConfig[];
    ServerConfigFilter: ServerConfig;
    ServerConfigtableUrl: string;
};
