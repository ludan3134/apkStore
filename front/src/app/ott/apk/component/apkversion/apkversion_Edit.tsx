import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextareaAutosizeElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import {grpcApkversionEdit} from "../../api/apkversion/grpcApkversionEdit";
import {useproxy_ApkdetailEdit} from "../../store/apkversion/store";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";

export const Apkversion_Edit = () => {
    const {id} = useParams();

    // 获取查看apk权限
    var permissions = authProxy.permissions;
    const ApkversionTable = permissions.find(
        (option) => option.name === "查看APK版本",
    );
    // 获取到对应版本数据
    var apkversion = useproxy_ApkdetailEdit();
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkDetail>({
        // 初始化表单数据
        defaultValues: {
            id: apkversion.id,
            version: apkversion.version,
            md5: apkversion.md5,
            url: apkversion.url,
            content: apkversion.content,
            forceUpdate: apkversion.forceUpdate,
            savePosition: apkversion.savePosition,
            filesize: apkversion.filesize,
            created: apkversion.created,
            updated: apkversion.updated,
            deleted: apkversion.deleted,
            forceUninstall: apkversion.forceUninstall,
        },
    });
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 表单提交时的回调函数
    const onSubmit = async (data: ApkDetail) => {
        setLoading(true);
        try {
            var response = await grpcApkversionEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功!");

                goto(
                    `${ApkversionTable?.url}/${ApkversionTable?.id}/${apkversion.apkId}`,
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
        goto(`${ApkversionTable?.url}/${ApkversionTable?.id}/${apkversion.apkId}`);
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
                <LocationBar location={"编辑apk版本"}/>
                <TextFieldElement name="version" label="版本"/>
                <TextareaAutosizeElement name="content" label="内容"/>
                <TextFieldElement name="savePosition" label="保存地址"/>
                <SelectElement
                    size={"medium"}
                    label="强制更新"
                    name="forceUpdate"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="强制卸载"
                    name="forceUninstall"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
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
