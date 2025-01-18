import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {AddStoreProxy, initialAddfilterParams} from "../store/store";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

const Add_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Advertisement>({
        defaultValues: initialAddfilterParams,
    });
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    const handleSubFormSubmit = (data: Advertisement) => {
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        AddStoreProxy.AddFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        AddStoreProxy.AddFilter = {} as Advertisement;
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
                <TextFieldElement name="name" label="名称"/>
                <TextFieldElement name="type" label="类型"/>
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

export default Add_Filter;
