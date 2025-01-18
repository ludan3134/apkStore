import React, {useEffect, useState} from "react";
import {message, TreeSelect} from "antd";
import {grpcAllDistributor} from "../../../app/distributor/api/grpcAllDistributor";
import {useTranslation} from "react-i18next";

export default function Distributorinput({
                                             setDistributorvalue,
                                             Distributorvalue,
                                         }) {
    const [value, setValue] = useState<string>(Distributorvalue);
    const [treeData, setTreeData] = useState();
    const {t} = useTranslation();

    const fetchModelData = async () => {
        setValue(Distributorvalue);
        const res = await grpcAllDistributor();
        if (res.tree.length === 0) {
            message.error("暂无添加的分销商!");
            return;
        } else {
            setTreeData(res.tree);
        }
    };
    useEffect(() => {
        fetchModelData();
    }, [Distributorvalue]);
    const onChange = (newValue: string) => {
        setValue(newValue);
        setDistributorvalue(newValue);
    };
    return (
        <TreeSelect
            showSearch
            style={{width: "30%", height: "60px"}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: "auto"}}
            placeholder={t("Please select the distributor and model")}
            allowClear
            treeDefaultExpandAll={false}
            onChange={onChange}
            treeData={treeData}
        />
    );
}
