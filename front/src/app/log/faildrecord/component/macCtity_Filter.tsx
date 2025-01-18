import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {IsConfirmDialog} from "../../../../const/alert/store";
import {MacCityFilter} from "../../../../api/ax/v1/axm_pb";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {MacActivityStoreProxy} from "../store/maccity/store";

const MacCtiry_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MacCityFilter>({
        defaultValues: {},
    });
    const [Distributorvalue, setDistributorvalue] = useState<string>();
    const [Modelvalue, setModelvalue] = useState<string>();
    const handleSubFormSubmit = (data: MacCityFilter) => {
        MacActivityStoreProxy.MacActivityFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        MacActivityStoreProxy.MacActivityFilter = {} as MacCityFilter;
        setDistributorvalue(null);
        setModelvalue(null);
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
            <Stack direction="row" spacing={1}>
                <Stack
                    direction="row"
                    spacing={1}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <TextFieldElement name="mac" label="mac地址"/>
                    <TextFieldElement name="ts" label="时间戳"/>
                    <TextFieldElement name="country" label="国家"/>
                    <TextFieldElement name="city" label="城市"/>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                </Stack>

                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default MacCtiry_Filter;
