import {CategoryLabel, ClassLabel, RecommendApk,} from "../../../../api/ta/v1/tam_pb";

export type RecommendStore = {
    RecommendEdit: RecommendApk;
    Recommendlist: RecommendApk[];
    RecommendFilter: RecommendApk;
    RecommendtableUrl: string;
    AllOption: ClassLabel[];
    AllCategory: CategoryLabel[];
};
