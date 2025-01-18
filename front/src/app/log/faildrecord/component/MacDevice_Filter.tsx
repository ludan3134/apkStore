import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {IsConfirmDialog} from "../../../../const/alert/store";
import {MacDevice} from "../../../../api/ax/v1/axm_pb";
import {initialMacApkParams} from "../store/macapk/store";
import {MacDeviceStoreProxy} from "../store/macdevice/store";

export default function MacDevice_Filter() {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MacDevice>({
        defaultValues: initialMacApkParams,
    });
    const handleSubFormSubmit = (data: MacDevice) => {
        MacDeviceStoreProxy.MacDeviceFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        MacDeviceStoreProxy.MacDeviceFilter = {} as MacDevice;
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
                    <TextFieldElement name="modelName" label="型号名"/>
                    <TextFieldElement name="version" label="版本"/>
                    <TextFieldElement name="buildId" label="buildId"/>

                </Stack>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

