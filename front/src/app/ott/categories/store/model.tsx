import {ApkCategory} from "../../../../api/ws/v1/wm_pb";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";

export type ApkCategoryStore = {
    ApkCategoryEdit: ApkCategory;
    ApkCategoryList: ApkCategory[];
    ApkCategoryUrl: string;
    ApkCategoryFilter: ApkCategory;
};
