import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {IsConfirmDialog} from "../../../../const/alert/store";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";
import {FailedRecord} from "../../../../api/ax/v1/axm_pb";
import {FailedRecordStoreProxy} from "../store/failedRecord/store";

const FailRecord_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<FailedRecord>({
        defaultValues: {},
    });
    // 获取xstreamtable地址信息
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    const handleSubFormSubmit = (data: FailedRecord) => {
        FailedRecordStoreProxy.FailedRecordFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        DistributorInputStoreProxy.DistributorValue = "";
        DistributorInputStoreProxy.ModelValue = "";
        FailedRecordStoreProxy.FailedRecordFilter = {} as FailedRecord;
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
                </Stack>
                {/*<Stack sx={{minWidth: "300px"}}>*/}
                {/*    <Distributor2Model/>*/}
                {/*</Stack>*/}
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default FailRecord_Filter;
