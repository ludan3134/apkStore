import {Advertisement} from "../../../../api/fs/v1/fm_pb";

export type AddStore = {
    AddEdit: Advertisement;
    Addlist: Advertisement[];
    AddFilter: Advertisement;
    AddtableUrl: string;
};
