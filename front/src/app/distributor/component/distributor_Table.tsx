import React, {useEffect, useState} from "react";
import type {TableProps} from "antd";
import {message, Table} from "antd";
import Distributor_Alldistributor from "./distributor_Edit/distributor_Alldistributor";
import {TreeNode} from "../../../api/ax/v1/axm_pb";
import {grpcDistributorTreetable} from "../api/grpcDistributorTreetable";
import {authProxy} from "../../auth/store/store";
import {DistributorTree_column} from "./distributor_Column";
import {TableParams, TableRowSelection} from "../store/model";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../const/alert/store";
import Button_addDistributor from "./Button_addDistributor"; // 引入样式文件

// rowSelection objects indicates the need for row selection
const rowSelection: TableRowSelection<TreeNode> = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows,
        );
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
    checkStrictly: true,
};

export default function Distributor_Table() {
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [filterValue, setFilterValue] = useState();
    const [treeData, setTreeData] = useState();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10,
            showTotal: (total) => {
                console.log("我是total", total);
                return `共 ${total} 条`;
            },
        },
    });
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();

    const fetchData = async () => {
        setLoading(true);
        var res = await grpcDistributorTreetable(
            tableParams.pagination.current,
            10,
            filterValue,
            authProxy.token,
        );
        if (res.status) {
            setLoading(false);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res.pageMeta?.totalRecords,
                },
            });
            setTreeData(res.distributorList);
        } else {
            message.error("获取数据失败");
        }
    };
    // const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    //     console.log("pagination",pagination)
    //     setTableParams({
    //         pagination,
    //         filters,
    //         ...sorter,
    //     });
    //     // `dataSource` is useless since `pageSize` changed
    //     if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //         setTreeData([]);
    //     }
    //     // if (pagination.pageSize !== tableParams.pagination?.pageSize) {
    //     //     setTreeData([]);
    //     // }
    // };
    const handleTableChange: TableProps["onChange"] = (
        pagination,
        filters,
        sorter,
    ) => {
        console.log("pagination", pagination);

        const updatedPagination = {
            ...pagination,
            showTotal: (total: number) => `共 ${total} 条`,
        };

        setTableParams((prevParams) => ({
            ...prevParams,
            pagination: updatedPagination,
            filters,
            ...sorter,
        }));
    };

    useEffect(() => {
        fetchData();
        IsConfirmDialog.refleshPage = false;
    }, [JSON.stringify(tableParams), filterValue, refleshPage]);

    return (
        <>
            <Distributor_Alldistributor setParentValue={setFilterValue}/>
            <Table
                columns={DistributorTree_column}
                rowSelection={{...rowSelection, checkStrictly}}
                dataSource={treeData}
                loading={loading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
            <Button_addDistributor/>
        </>
    );
}
