import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {IsConfirmDialog} from "../../../../const/alert/store";
import {MacApk} from "../../../../api/ax/v1/axm_pb";
import {initialMacApkParams, MacApkStoreProxy} from "../store/macapk/store";

export default function MacApk_Filter() {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MacApk>({
        defaultValues: initialMacApkParams,
    });
    const handleSubFormSubmit = (data: MacApk) => {
        MacApkStoreProxy.MacApkFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        MacApkStoreProxy.MacApkFilter = {} as MacApk;
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
                    <TextFieldElement name="class" label="包名"/>

                </Stack>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

