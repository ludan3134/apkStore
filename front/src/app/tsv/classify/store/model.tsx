import {Category} from "../../../../api/ta/v1/tam_pb";

export type CategoryStore = {
    CategoryEdit: Category;
    Categorylist: Category[];
    CategoryFilter: Category;
    CategorytableUrl: string;
};
