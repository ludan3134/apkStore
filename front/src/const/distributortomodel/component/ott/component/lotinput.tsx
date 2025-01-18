import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {authProxy} from "../../../../../app/auth/store/store";
import {grpcAllLot} from "../../../../../app/ott/lot/api/grpcAllLot";

export default function Lotinput({Distributorvalue, seLotvalue}) {
    const [lotData, setLotData] = useState();
    const [value, setValue] = useState();
    const fetchModelData = async () => {
        if (Distributorvalue === null || typeof Distributorvalue === "undefined") {
            setLotData(null);
            seLotvalue(null);
            return;
        }
        const res = await grpcAllLot(Distributorvalue, authProxy.token);
        console.log("aa", res.lotList);
        setLotData(res.lotList);
    };
    useEffect(() => {
        setLotData(null);
        setValue(null);
        fetchModelData();
    }, [Distributorvalue]);
    const filterOption = (
        input: string,
        option?: { label: string; value: string },
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    const onChange = (value: string) => {
        console.log(`selected ${value}`);
        setValue(value);
        seLotvalue(value);
    };

    const onSearch = (value: string) => {
        console.log("search:", value);
    };
    return (
        <Select
            showSearch
            placeholder="请选择对应的批次"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={filterOption}
            options={lotData}
            value={value}
        />
    );
}
