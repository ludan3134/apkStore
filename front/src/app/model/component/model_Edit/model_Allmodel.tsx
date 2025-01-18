import React, {useState} from "react";
import {TreeSelect} from "antd";
import {useproxy_AllModel} from "../../store/store";

export default function Model_Allmodel({setParentValue}) {
    const [value, setValue] = useState<string>();
    var treeData = useproxy_AllModel();
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
            placeholder="请选择型号"
            allowClear
            treeDefaultExpandAll={false}
            onChange={onChange}
            treeData={treeData}
            treeNodeFilterProp={"title"}

        />
    );
}
