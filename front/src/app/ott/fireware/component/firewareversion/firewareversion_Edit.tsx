import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useproxy_FirewaredetailEdit} from "../../store/firewareversion/store";
import {grpcFirewareversionEdit} from "../../api/firewareversion/grpcFirewareversionEdit";
import {authProxy} from "../../../../auth/store/store";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";
import {IsOpenDialog} from "../../../../../const/alert/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption, UpdateFirewareversionOption,} from "../../../../../const/option";

export const Firewareversion_Edit = () => {
    const {id} = useParams();

    // 获取查看firmware权限
    var permissions = authProxy.permissions;
    const FirmwareversionTable = permissions.find(
        (option) => option.name === "查看固件版本",
    );
    // 获取到对应版本数据
    var firmwareversion = useproxy_FirewaredetailEdit();
    console.log("firmwareversion", firmwareversion.firmwareId);
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<FirmwareDetail>({
        // 初始化表单数据
        defaultValues: {
            id: firmwareversion.id,
            version: firmwareversion.version,
            md5: firmwareversion.md5,
            url: firmwareversion.url,
            content: firmwareversion.content,
            forceUpdate: firmwareversion.forceUpdate,
            savePosition: firmwareversion.savePosition,
            filesize: firmwareversion.filesize,
            created: firmwareversion.created,
            updated: firmwareversion.updated,
            deleted: firmwareversion.deleted,
            buildId: firmwareversion.buildId,
            currentVersion: firmwareversion.currentVersion,
            packageType: firmwareversion.packageType,
        },
    });
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 表单提交时的回调函数
    const onSubmit = async (data: FirmwareDetail) => {
        setLoading(true);
        try {
            var response = await grpcFirewareversionEdit(data, authProxy.token);
            if (response.status) {
                IsOpenDialog.IsOpen = true;
                IsOpenDialog.title = "SUCCESS";
                IsOpenDialog.content = "更新成功";
                goto(
                    `${FirmwareversionTable?.url}/${FirmwareversionTable?.id}/${firmwareversion.firmwareId}`,
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
            `${FirmwareversionTable?.url}/${FirmwareversionTable?.id}/${firmwareversion.firmwareId}`,
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
                <LocationBar location={"编辑firmware版本"}/>
                <TextFieldElement name="version" label="版本"/>
                <TextFieldElement name="content" label="内容"/>
                <TextFieldElement name="savePosition" label="保存地址"/>
                <TextFieldElement name="buildId" label="buildId"/>
                <TextFieldElement name="currentVersion" label="当前版本"/>
                <SelectElement
                    size={"medium"}
                    label="是否增量包"
                    name="packageType"
                    options={UpdateFirewareversionOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="强制更新"
                    name="forceUpdate"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
            </Stack>
            <DialogActions>
                {/*<IconButton aria-label="delete" size="large" onClick={() => handleReturn()}>*/}
                {/*    <KeyboardReturnIcon color={"primary"}/>*/}
                {/*</IconButton>*/}
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
