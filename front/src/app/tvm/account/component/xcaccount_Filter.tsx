import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {MacAccount} from "../../../../api/ks/v1/km_pb";
import {XCAccountStoreproxy} from "../store/store";
import {usageOption, XCTypeOption} from "../../../../const/option";
import {useproxy_allXCombo} from "../../live/xc_combination/store/store";
import {authProxy} from "../../../auth/store/store";
import envUrls from "../../../../const/baseurl";
import {grpcAccountExport} from "../api/grpcAccountExport";

export const Xcaccount_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MacAccount>({
        defaultValues: {
            macAccountTable: "live"
        },
    });

    const handleSubFormSubmit = (data: MacAccount) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;
        console.log("data", data);
        XCAccountStoreproxy.XCACCountFilter = data;
    };
    const handleExportFile = async () => {
        try {
            const data = formContext.getValues();

            const res = await grpcAccountExport(data, authProxy.token);
            console.log("地址:", envUrls.ExportAccountFile + res.path)
            window.open(envUrls.ExportAccountFile + res.path)
        } catch (error) {
            console.error("导出文件失败:", error);
            // 这里可以处理错误，例如显示错误消息
        }
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        XCAccountStoreproxy.XCACCountFilter = {} as MacAccount;
    };
    var allXCombo = useproxy_allXCombo();

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
                <TextFieldElement name="mac" label="mac"/>
                <SelectElement
                    label="XC用户类型"
                    name="macAccountTable"
                    options={XCTypeOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <TextFieldElement name="username" label="用户姓名"/>
                <TextFieldElement name="password" label="用户密码"/>
                <SelectElement
                    label="套餐"
                    name="comboId"
                    options={allXCombo}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="用途"
                    name="usage"
                    options={usageOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />

                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
                <Button type="button" onClick={() => handleExportFile()}>
                    导出
                </Button>
            </Stack>
        </FormContainer>
    );
};
