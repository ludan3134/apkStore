import {Advertisement} from "../../../../api/tv_fs/v1/fm_pb";

export type TVAddStore = {
    TVAddEdit: Advertisement;
    TVAddlist: Advertisement[];
    TVAddFilter: Advertisement;
    TVAddtableUrl: string;
};
