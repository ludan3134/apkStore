import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {XstreamResource} from "../../../../../api/ks/v1/km_pb";
import {initialXStreamParams, XStreamStoreProxy} from "../store/store";
import {ResourceTypeOption} from "../../../../../const/option";

export const Xcmapping_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<XstreamResource>({
        defaultValues: initialXStreamParams,
    });

    const handleSubFormSubmit = (data: XstreamResource) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;
        console.log("data", data);
        XStreamStoreProxy.XStreamFilter = data;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        XStreamStoreProxy.XStreamFilter = {} as XstreamResource;
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
                <TextFieldElement name="name" label="资源名称"/>
                <TextFieldElement name="bouquetId" label="资源标志"/>
                <SelectElement
                    label="资源类型"
                    name="resourceType"
                    options={ResourceTypeOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};
