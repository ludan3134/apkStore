import React, {useEffect, useState} from "react";
import {message, TreeSelect} from "antd";
import {grpcAllDistributor} from "../../../app/distributor/api/grpcAllDistributor";
import {DistributorInputStoreProxy, useproxy_DistributorValue, useproxy_ModelValue,} from "../store/store";
import {grpcAllModel} from "../../../app/distributor/api/grpcAllModel";
import {authProxy} from "../../../app/auth/store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../alert/store";

const Distributor2Model: React.FC = () => {
    var distributorValue = useproxy_DistributorValue();
    var modelValue = useproxy_ModelValue();
    const [treeData, setTreeData] = useState();
    const [modelTreeData, setModelTreeData] = useState();
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();

    // 分销商
    const fetchDistributorData = async () => {
        const res = await grpcAllDistributor();
        if (res.tree.length === 0) {
            message.error("暂无添加的分销商!");
            return;
        } else {
            setTreeData(res.tree);
        }
    };
    // 型号
    const fetchModelData = async (value: string) => {
        const res = await grpcAllModel(distributorValue, authProxy.token);
        setModelTreeData(res.tree);
    };
    useEffect(() => {
        fetchDistributorData();
        fetchModelData(distributorValue);
        IsConfirmDialog.refleshPage = false;
    }, [refleshPage]);
    const onFirstTreeChange = async (value: string) => {
        DistributorInputStoreProxy.DistributorValue = value;
        const res = await grpcAllModel(value, authProxy.token);
        setModelTreeData(res.tree);
        DistributorInputStoreProxy.ModelValue = "";
    };
    //
    const onSecondTreeChange = (value: string) => {
        DistributorInputStoreProxy.ModelValue = value;
    };

    return (
        <div>
            <TreeSelect
                showSearch
                style={{width: "50%", height: "60px"}}
                value={distributorValue}
                dropdownStyle={{maxHeight: 400, overflow: "auto"}}
                placeholder="Please select the first tree"
                allowClear
                treeDefaultExpandAll
                onChange={onFirstTreeChange}
                treeData={treeData}
            />
            <TreeSelect
                showSearch
                style={{width: "50%", height: "60px"}}
                value={modelValue}
                dropdownStyle={{maxHeight: 400, overflow: "auto"}}
                placeholder="Please select the second tree"
                allowClear
                treeDefaultExpandAll
                onChange={onSecondTreeChange}
                treeData={modelTreeData}
            />
        </div>
    );
};

export default Distributor2Model;
