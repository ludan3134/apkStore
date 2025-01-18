import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {AppVersion} from "../../../../../api/ws/v1/wm_pb";
import {initialAppVersionParams} from "../../store/appversion/store";
import {grpcAppsversionInsert} from "../../api/apkversion/grpcAppversionInsert";

export const Appsversion_Add = () => {
    // 获取查看Apps版本权限
    var permissions = authProxy.permissions;
    const AppsversionTable = permissions.find(
        (option) => option.name === "查看Apps版本",
    );
    // 获取到AppsId 和 modelName 参数
    const {id, classX} = useParams();
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    const [AppsversionRes, setAppsversionRes] = useState<UploadResponse>();

    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 返回上一级
    const handleReturn = () => {
        goto(`${AppsversionTable?.url}/${AppsversionTable?.id}/${id}/${classX}`);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AppVersion>({
        // 初始化表单数据
        defaultValues: initialAppVersionParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (Appsversion: AppVersion) => {
        setLoading(true);
        console.log("报名", classX);
        console.log("modelName1", id);
        Appsversion.class = classX;
        Appsversion.appId = parseInt(id, 10) as number;
        // 上传文件判断
        if (!AppsversionRes) {
            message.error("请上传Apps版本文件");
            setLoading(false);
            return;
        }
        try {
            console.log("aa", AppsversionRes);
            Appsversion.url = AppsversionRes.media_uri;
            Appsversion.md5 = AppsversionRes.md5;
            Appsversion.filesize = AppsversionRes.file_size;
            var res = await grpcAppsversionInsert(Appsversion, authProxy.token);
            if (res.status) {
                console.log("AppsTable", AppsversionTable);
                goto(
                    `${AppsversionTable?.url}/${AppsversionTable?.id}/${id}/${classX}`,
                );
                return true; // 添加返回 true 停止循环
            } else {
                handleResetForm();
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        formContext.reset(); // 重置表单值
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
                <LocationBar location={"新增Apps版本"}/>
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
                    label="isShowToolTip"
                    name="isShowToolTip"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"Appsversion Add"}
                        dir={"/Apps/AppsVersion/" + Date.now().toString() + "/"}
                        setRes={setAppsversionRes}
                        file_type={null}
                    />
                </Stack>
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
