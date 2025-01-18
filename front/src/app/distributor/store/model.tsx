import {GetProp, TablePaginationConfig, TableProps} from "antd";
import {TreeNode} from "primereact/treenode";

export type DistributorTreeStore = {
    AllDistributor: TreeNode[];
    IsUserChange: boolean;
};

export type TableRowSelection<T> = TableProps<T>["rowSelection"];

export interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}
