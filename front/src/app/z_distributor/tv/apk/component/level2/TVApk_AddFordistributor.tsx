import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../../auth/store/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../../const/option";
import {useproxy_ApkFilter, useproxy_ApktableUrl,} from "../../store/level2/store";
import {Apk} from "../../../../../../api/tv_fs/v1/fm_pb";
import {useTranslation} from "react-i18next";
import {grpcApkInsert} from "../../../../../tv/TVapk/api/apk/grpcApkInsert";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";

export const TVApk_AddFordistributor = () => {
    const {t} = useTranslation();

    // 获取编辑变量
    var ApkFilter = useproxy_ApkFilter();
    // 获取Apktable地址信息
    var ApktableUrl = useproxy_ApktableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();

    // 上传返回数据
    const [TVApkIconRes, setTVApkIconRes] = useState<UploadResponse>();
    // const [TVApkScriRes, setTVApkScriRes] = useState<UploadResponse>();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apk>({
        // 初始化表单数据
        defaultValues: {star: 5, isWhite: true, downloadCount: 0},
    });

    // 提交表单
    const onSubmit = async (data: Apk) => {
        data.distributorId = ApkFilter.distributorId;
        data.modelId = ApkFilter.modelId;
        // 上传文件判断
        if (!TVApkIconRes) {
            message.error("请上传TVApk图标");
            setLoading(false);
            return;
        }
        data.img = TVApkIconRes.media_uri;
        // data.bannerImg = TVApkScriRes.media_uri;
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcApkInsert(data, authProxy.token);
            if (response.status) {
                message.success("新增成功");

                goto(ApktableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");
            setLoading(false);
            return;
        }
        goto(ApktableUrl);
        setLoading(false);
        IsUploadFileReset.IsReset = false;
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = false;
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(ApktableUrl);
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
                <LocationBar location={t("新增电视机APK")}/>
                <TextFieldElement name="name" label={t("name")} required/>
                <TextFieldElement name="type" label={t("类型")} required/>
                <TextFieldElement name="class" label={t("包名")} required/>
                <TextFieldElement name="sort" label={t("排序")} type={"number"}/>
                <Stack direction={"row"} spacing={2}>
                    <SelectElement
                        size={"medium"}
                        label={t("是否推送市场")}
                        name="isShowOnMarket"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                </Stack>
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"ApkIcon"}
                        dir={"/apk/apkIcon/" + Date.now().toString() + "/"}
                        setRes={setTVApkIconRes}
                        file_type={"tv"}
                    />
                    {/*<Uploadfile*/}
                    {/*	title={"ApkScri"}*/}
                    {/*	dir={"/apk/apkScri/" + Date.now().toString() + "/"}*/}
                    {/*	setRes={setTVApkScriRes}*/}
                    {/*	file_type={"tv"}*/}
                    {/*/>*/}
                </Stack>
            </Stack>

            <DialogActions>
                <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={() => handleReturn()}
                >
                    <KeyboardReturnIcon color={"primary"}/>
                </IconButton>
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
