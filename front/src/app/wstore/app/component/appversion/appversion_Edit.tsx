import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";

import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import {useproxy_AppVersionEdit, useproxy_ClassX,} from "../../store/appversion/store";
import {AppVersion} from "../../../../../api/ws/v1/wm_pb";
import {grpcAppsversionEdit} from "../../api/apkversion/grpcAppversionEdit";

export const Appsversion_Edit = () => {
    const {id} = useParams();

    // 获取查看Apps权限
    var permissions = authProxy.permissions;
    const AppsversionTable = permissions.find(
        (option) => option.name === "查看Apps版本",
    );
    // 获取到对应版本数据
    var Appsversion = useproxy_AppVersionEdit();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    var classX = useproxy_ClassX();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AppVersion>({
        // 初始化表单数据
        defaultValues: {
            id: Appsversion.id,
            appId: Appsversion.appId,
            versionName: Appsversion.versionName,
            dateReleased: Appsversion.dateReleased,
            changelog: Appsversion.changelog,
            isLatest: Appsversion.isLatest,
            isPublic: Appsversion.isPublic,
            isPaid: Appsversion.isPaid,
            filesize: Appsversion.filesize,
            md5: Appsversion.md5,
            url: Appsversion.url,
            forceUninstall: Appsversion.forceUninstall,
            deleted: Appsversion.deleted,
        },
    });
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 表单提交时的回调函数
    const onSubmit = async (data: AppVersion) => {
        setLoading(true);
        try {
            var response = await grpcAppsversionEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功!");

                goto(
                    `${AppsversionTable?.url}/${AppsversionTable?.id}/${Appsversion.appId}/${classX}`,
                );
            }
        } catch (error) {
            // 处理异常情况
            console.error(error);
            // 显示错误信息或采取其他操作
        }
    };
    // 表单重置
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
    };

    // 返回上一级
    const handleReturn = () => {
        goto(
            `${AppsversionTable?.url}/${AppsversionTable?.id}/${Appsversion.appId}/${classX}`,
        );
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                onSubmit(data);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}
            <Stack spacing={2}>
                <LocationBar location={"编辑Apps版本"}/>
                <TextFieldElement name="versionName" label="版本名称"/>
                <TextFieldElement name="changelog" label="更新日志"/>
                <SelectElement
                    size={"medium"}
                    label="isPaid"
                    name="isPaid"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="isPublic"
                    name="isPublic"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="forceUninstall"
                    name="forceUninstall"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否最新"
                    name="isLatest"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
            </Stack>
            <DialogActions>
                <Button variant="contained" size="large" onClick={() => handleReturn()}>
                    返回上一级
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    type={"submit"}
                    color={"success"}
                >
                    提交
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    type="button"
                    onClick={() => handleResetForm()}
                    color={"error"}
                >
                    重置
                </Button>
            </DialogActions>
        </FormContainer>
    );
};
