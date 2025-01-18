import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {initialRecommendApkParams, RecommendStoreproxy,} from "../../store/level2/store";
import {IsConfirmDialog} from "../../../../../../const/alert/store";
import {RecommendApk} from "../../../../../../api/ta/v1/tam_pb";
import {useTranslation} from "react-i18next";

const Recommend_FilterForDistributor = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<RecommendApk>({
        defaultValues: initialRecommendApkParams,
    });
    const {t} = useTranslation();

    var distributorId = RecommendStoreproxy.RecommendFilter.distributorId;
    var modelId = RecommendStoreproxy.RecommendFilter.modelId;
    var classId = RecommendStoreproxy.RecommendFilter.classId;

    // // 获取xstreamtable地址信息
    // var classLabels = useproxy_AllOption();
    const handleSubFormSubmit = (data: RecommendApk) => {
        data.distributorId = distributorId;
        data.modelId = modelId;
        data.classId = classId;
        // 使用展开运算符将 data 的属性合并到 preservedFilter 中
        RecommendStoreproxy.RecommendFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        RecommendStoreproxy.RecommendFilter = {
            distributorId: distributorId,
            modelId: modelId,
            classId: classId,
        } as RecommendApk;
        IsConfirmDialog.refleshPage = true;
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
                    <TextFieldElement name="packageName" label={t("包名")}/>
                    <TextFieldElement name="appName" label={t("name")}/>
                    {/*<TextFieldElement name="lang" label="语言" />*/}
                    {/*<SelectElement*/}
                    {/*	label={t("类型")}*/}
                    {/*	name="classId"*/}
                    {/*	options={classLabels}*/}
                    {/*	sx={{*/}
                    {/*		minWidth: "180px",*/}
                    {/*	}}*/}
                    {/*/>*/}
                </Stack>
                <Button type="submit"> {t("筛选")}</Button>
                <Button type="button" onClick={handleResetForm}>
                    {t("reset")}
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Recommend_FilterForDistributor;
