import {Categories} from "../../../../api/ws/v1/wm_pb";

export type CategoriesStore = {
    CategoriesEdit: Categories;
    CategoriesList: Categories[];
    CategoriesUrl: string;
    CategoriesFilter: Categories;
};
