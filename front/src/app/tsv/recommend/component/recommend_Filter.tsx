import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {initialRecommendApkParams, RecommendStoreproxy, useproxy_AllOption,} from "../store/store";
import {RecommendApk} from "../../../../api/ta/v1/tam_pb";
import {IsConfirmDialog} from "../../../../const/alert/store";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";

const Recommend_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<RecommendApk>({
        defaultValues: initialRecommendApkParams,
    });
    // 获取xstreamtable地址信息
    var classLabels = useproxy_AllOption();
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    const handleSubFormSubmit = (data: RecommendApk) => {
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        RecommendStoreproxy.RecommendFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        DistributorInputStoreProxy.DistributorValue = "";
        DistributorInputStoreProxy.ModelValue = "";
        RecommendStoreproxy.RecommendFilter = {} as RecommendApk;
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
                    <TextFieldElement name="packageName" label="包名"/>
                    <TextFieldElement name="appName" label="名称"/>
                    <TextFieldElement name="lang" label="语言"/>
                    <SelectElement
                        label="类型"
                        name="classId"
                        options={classLabels}
                        sx={{
                            minWidth: "180px",
                        }}
                    />
                </Stack>
                <Stack sx={{minWidth: "300px"}}>
                    <Distributor2Model/>
                </Stack>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Recommend_Filter;
