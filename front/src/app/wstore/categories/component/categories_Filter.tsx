import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {Categories} from "../../../../api/ws/v1/wm_pb";
import {CategoriesStoreProxy, initialCategoriesfilterParams,} from "../store/store";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

const Categories_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Categories>({
        defaultValues: initialCategoriesfilterParams,
    });
    // distributor
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    const handleSubFormSubmit = (data: Categories) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        CategoriesStoreProxy.CategoriesFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        setModelvalue(null);
        CategoriesStoreProxy.CategoriesFilter = {} as Categories;
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem/>}
            >
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Categories_Filter;
