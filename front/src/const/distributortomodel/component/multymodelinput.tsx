import React, {useEffect, useState} from "react";
import {TreeSelect} from "antd";
import {grpcAllModel} from "../../../app/distributor/api/grpcAllModel";
import {authProxy} from "../../../app/auth/store/store";

export default function Multymodelinput({Distributorvalue, setModelvalue}) {
    const [value, setValue] = useState<string>([]);
    const [treeData, setTreeData] = useState();
    const fetchModelData = async () => {
        setValue([]);
        setModelvalue([]);
        if (Distributorvalue === "" || typeof Distributorvalue === "undefined") {
            setTreeData(null);
            return;
        }
        const res = await grpcAllModel(Distributorvalue, authProxy.token);
        setTreeData(res.tree);
    };
    useEffect(() => {
        fetchModelData();
    }, [Distributorvalue]);
    const onChange = (newValue: string) => {
        setValue(newValue);
        setModelvalue(newValue);
    };
    return (
        <TreeSelect
            showSearch
            style={{width: "100%", height: "60px"}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: "auto"}}
            placeholder="请选择型号"
            allowClear
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
        />
    );
}
