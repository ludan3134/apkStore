import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import {authProxy} from "../../../../../auth/store/store";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {ApkDetail} from "../../../../../../api/tv_fs/v1/fm_pb";
import {initialTVApkdetailParams} from "../../../../../tv/TVapk/store/apkversion/store";
import {grpcApkversionInsert} from "../../../../../tv/TVapk/api/apkversion/grpcApkversionInsert";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../../const/option";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import {useTranslation} from "react-i18next";

export const TVapkversion_AddForDistributor = () => {
    const {t} = useTranslation();

    // 获取查看TVApk版本权限
    var permissions = authProxy.permissions;
    const TVApkversionTable = permissions.find(
        (option) => option.name === "分销商查看电视Apk版本",
    );
    // 获取到TVApkId 和 modelName 参数
    const {id, apkId} = useParams();
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    const [TVApkversionRes, setTVApkversionRes] = useState<UploadResponse>();

    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 返回上一级
    const handleReturn = () => {
        goto(`${TVApkversionTable?.url}/${TVApkversionTable?.id}/${apkId}`);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkDetail>({
        // 初始化表单数据
        defaultValues: initialTVApkdetailParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (TVApkversion: ApkDetail) => {
        setLoading(true);
        TVApkversion.apkId = apkId;
        // 上传文件判断
        if (!TVApkversionRes) {
            message.error("请上传TVApk版本文件");
            setLoading(false);
            return;
        }
        try {
            console.log("aa", TVApkversionRes);
            TVApkversion.url = TVApkversionRes.media_uri;
            TVApkversion.md5 = TVApkversionRes.md5;
            TVApkversion.filesize = TVApkversionRes.file_size;
            var res = await grpcApkversionInsert(TVApkversion, authProxy.token);
            if (res.status) {
                console.log("TVApkTable", TVApkversionTable);
                goto(`${TVApkversionTable?.url}/${TVApkversionTable?.id}/${apkId}`);
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
        IsUploadFileReset.IsReset = false;
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
                <LocationBar location={t("add")}/>
                <TextFieldElement name="version" label={t("version")}/>
                <TextFieldElement name="content" label={t("content")}/>
                <SelectElement
                    size={"medium"}
                    label={t("强制更新")}
                    name="forceUpdate"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                {/*<SelectElement*/}
                {/*	size={"medium"}*/}
                {/*	label={t("delete")}*/}
                {/*	name="status"*/}
                {/*	options={IsBoolOption}*/}
                {/*	sx={{*/}
                {/*		minWidth: "150px",*/}
                {/*	}}*/}
                {/*/>*/}
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"TVApkScri"}
                        dir={"/TVApk/TVApkVersion/" + Date.now().toString() + "/"}
                        setRes={setTVApkversionRes}
                        file_type={"tv"}
                    />
                </Stack>
            </Stack>
            <DialogActions>
                <Button variant="contained" size="large" onClick={() => handleReturn()}>
                    {t("Return to Previous Level")}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    type={"submit"}
                    color={"success"}
                >
                    {t("submit")}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    type="button"
                    onClick={() => handleResetForm()}
                    color={"error"}
                >
                    {t("reset")}
                </Button>
            </DialogActions>
        </FormContainer>
    );
};
