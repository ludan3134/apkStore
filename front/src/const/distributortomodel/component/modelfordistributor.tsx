import React, {useEffect, useState} from "react";
import {TreeSelect} from "antd";
import {grpcAllModel} from "../../../app/distributor/api/grpcAllModel";
import {authProxy} from "../../../app/auth/store/store";
import {useTranslation} from "react-i18next";

export default function Modelfordistributor({ModelValue, setModelvalue}) {
    const [value, setValue] = useState<string>();
    const [treeData, setTreeData] = useState();
    const {t} = useTranslation();

    const fetchModelData = async () => {
        const res = await grpcAllModel("", authProxy.token);
        setTreeData(res.tree);
    };
    useEffect(() => {
        fetchModelData();
        setValue(ModelValue);
    }, []);
    const onChange = (newValue: string) => {
        setValue(newValue);
        setModelvalue(newValue);
    };
    return (
        <TreeSelect
            showSearch
            style={{width: "25%", height: "60px"}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: "auto"}}
            placeholder={t("Please select the distributor and model")}
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeData}
        />
    );
}
