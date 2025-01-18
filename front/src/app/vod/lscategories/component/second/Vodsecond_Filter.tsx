import React from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {Vod} from "../../../../../api/ks/v1/km_pb";
import {VodStoreProxy} from "../../store/second/store";

const VodsecondTable_filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Vod>({
        defaultValues: {},
    });
    const handleSubFormSubmit = (data: Vod) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        VodStoreProxy.VodFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        VodStoreProxy.VodFilter = {} as Vod;
    };


    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}>
            <Stack direction="row" spacing={2}>
                <Stack spacing={2}>
                    <TextFieldElement name="name" label="点播分类名称"/>
                </Stack>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default VodsecondTable_filter;
