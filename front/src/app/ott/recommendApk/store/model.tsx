import {RecommendApk} from "../../../../api/fs/v1/fm_pb";
import {CategoryLabel, ClassLabel} from "../../../../api/ta/v1/tam_pb";

export type RecommendStore = {
    RecommendEdit: RecommendApk;
    Recommendlist: RecommendApk[];
    RecommendFilter: RecommendApk;
    RecommendtableUrl: string;
    AllOption: ClassLabel[];
    AllCategory: CategoryLabel[];
};
