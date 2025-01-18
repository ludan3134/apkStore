import {AllCategoriesLabel, AllPricePlanLabel, Apps,} from "../../../../../api/ws/v1/wm_pb";

export type AppsStore = {
    AppsEdit: Apps;
    Appslist: [];
    AppsFilter: Apps;
    AppstableUrl: string;
    AppsCopy: Apps[];
    allCategories: AllCategoriesLabel[];
    allPriceplans: AllPricePlanLabel[];
};

export type AppsCopyparams = {
    AppIds: number[];
    distributorId: number;
    modelId: number;
    categoriesIds: number[];
    priceplans: number[];
};
