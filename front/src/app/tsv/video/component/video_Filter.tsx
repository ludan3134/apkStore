import React from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {initialVideoParams, VideoStoreproxy} from "../store/store";
import {IsConfirmDialog} from "../../../../const/alert/store";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";
import {Video} from "../../../../api/ta/v1/tam_pb";
import {useproxy_AllCategory, useproxy_AllOption,} from "../../recommend/store/store";

const Video_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Video>({
        defaultValues: initialVideoParams,
    });
    var alloption = useproxy_AllOption();
    var allCategory = useproxy_AllCategory();
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    const handleSubFormSubmit = (data: Video) => {
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        VideoStoreproxy.VideoFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        DistributorInputStoreProxy.DistributorValue = "";
        DistributorInputStoreProxy.ModelValue = "";
        VideoStoreproxy.VideoFilter = {} as Video;
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
                <TextFieldElement name="title" label="标题"/>
                <TextFieldElement name="videoId" label="YoutubeID"/>
                <TextFieldElement name="hl" label="语言"/>
                <SelectElement
                    label="选项"
                    name="classId"
                    options={alloption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="菜单"
                    name="categoryId"
                    options={allCategory}
                    sx={{
                        minWidth: "180px",
                    }}
                />
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

export default Video_Filter;
