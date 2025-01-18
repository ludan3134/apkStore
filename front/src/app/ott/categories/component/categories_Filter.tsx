import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {ApkCategoryStoreProxy, initialApkCategoryfilterParams,} from "../store/store";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";

const ApkCategory_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkCategory>({
        defaultValues: initialApkCategoryfilterParams,
    });

    const handleSubFormSubmit = (data: ApkCategory) => {
        ApkCategoryStoreProxy.ApkCategoryFilter = data;
        // apkProxy.isRowChange = true
    };

    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        ApkCategoryStoreProxy.ApkCategoryFilter = {} as ApkCategory;
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
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default ApkCategory_Filter;
