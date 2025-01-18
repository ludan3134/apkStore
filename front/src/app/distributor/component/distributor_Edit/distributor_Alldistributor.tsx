import React, {useState} from "react";
import {TreeSelect} from "antd";
import {useproxy_AllDistributor} from "../../store/store";

export default function Distributor_Alldistributor({setParentValue}) {
    const [value, setValue] = useState<string>();
    var treeData = useproxy_AllDistributor();
    const onChange = (newValue: string) => {
        setValue(newValue);
        setParentValue(newValue);
    };
    return (
        <TreeSelect
            showSearch
            style={{width: "100%"}}
            value={value}
            dropdownStyle={{maxHeight: 400, overflow: "auto"}}
            placeholder="请选择分销商"
            allowClear
            treeDefaultExpandAll={false}
            onChange={onChange}
            treeData={treeData}
            filterTreeNode={true}
            treeNodeFilterProp={"title"}
        />
    );
}
