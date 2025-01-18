import React from "react";
import {TableColumnsType} from "antd";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import Button_Edit from "./distributor_Edit/Button_Edit";
import Button_addModel from "./Button_addModel";
import Button_showuser from "./Button_showUser";
import Button_bindUser from "./Button_bindUser";

export const DistributorTree_column: TableColumnsType<TreeNode> = [
    {
        title: "名称",
        dataIndex: "title",
        key: "title",
    },
    // {
    //     title: 'ID',
    //     dataIndex: 'value',
    //     align: "center",
    //     key: 'value',
    // },
    {
        title: "编辑分销商",
        key: "edit",
        align: "center",
        render: (_, record) => (
            <strong>
                <Button_Edit rows={record}/>
            </strong>
        ),
    },
    {
        title: "用户",
        key: "showUser",
        align: "center",
        render: (_, record) => (
            <strong>
                <Button_showuser rows={record}/>
            </strong>
        ),
    },
    {
        title: "绑定用户",
        key: "bindUser",
        align: "center",

        render: (_, record) => (
            <strong>
                <Button_bindUser rows={record}/>
            </strong>
        ),
    },
    // {
    //     title: '添加分销商',
    //     key: 'addDistributor',
    //     align: "center",
    //     render: (_, record) => (
    //         <strong>
    //             <Button_addDistributor/>
    //         </strong>
    //     ),
    // },
    {
        title: "分配型号",
        key: "AssignModel",
        align: "center",
        render: (_, record) => (
            <strong>
                <Button_addModel rows={record}/>
            </strong>
        ),
    },
    // {
    //     title: "查看型号",
    //     key: "findModel",
    //     align: "center",
    //     render: (_, record) => (
    //         <strong>
    //             <Button_showModel rows={record}/>
    //         </strong>
    //     ),
    // },
];
