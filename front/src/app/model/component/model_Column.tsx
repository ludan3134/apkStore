import {TableColumnsType} from "antd";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import Button_Edit from "./model_Edit/Button_Edit";
import React from "react";

export const Model_Column: TableColumnsType<TreeNode> = [
    {
        title: "名称",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "ID",
        dataIndex: "value",
        align: "center",
        key: "value",
    },
    {
        title: "key",
        dataIndex: "key",
        width: "30%",
        key: "address",
    },
    {
        title: "编辑型号",
        key: "edit",
        align: "center",
        render: (_, record) => (
            <strong>
                <Button_Edit rows={record}/>
            </strong>
        ),
    },
    // {
    //     title: '添加型号',
    //     key: 'addDistributor',
    //     align: "center",
    //     render: (_, record) => (
    //         <strong>
    //             <Button_insertModel/>
    //         </strong>
    //     ),
    // },
];
