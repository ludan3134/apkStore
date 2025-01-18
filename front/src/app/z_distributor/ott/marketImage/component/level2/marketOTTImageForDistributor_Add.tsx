import React, {useState} from "react";
import {Button, Divider, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useTranslation} from "react-i18next";
import {message} from "antd";
import {AppBanner} from "../../../../../../api/tv_fs/v1/fm_pb";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {initialAppBannerParams, useproxy_AppBannerFilter, useproxy_AppBannertableUrl,} from "../../store/level2/store";
import {grpcmarketImageInsert} from "../../api/level2/grpcmarketImageInsert";
import {authProxy} from "../../../../../auth/store/store";
import LocationBar from "../../../../../../const/locationbar";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import {IsBoolOption} from "../../../../../../const/option";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import {useForm} from "react-hook-form";

export const MarketOTTImageForDistributor_Add = () => {
    const {t} = useTranslation();
    var appBanner = useproxy_AppBannerFilter();
    var picturetableUrl = useproxy_AppBannertableUrl();

    // 获取apktable地址信息

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const formContext = useForm<AppBanner>({
        // 初始化表单数据
        defaultValues: initialAppBannerParams,
    });
    // 分销商值
    // 上传返回数据
    const [deslImage, setDeslImage] = useState<UploadResponse>();
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = false;
        setDeslImage(null);
        formContext.reset();
    };
    // 使用 useForm 声明一个 formContext
    // 表单提交时的回调函数
    const onSubmit = async (add: AppBanner) => {
        setLoading(true);
        add.distributorId = appBanner.distributorId;
        add.modelId = appBanner.modelId;
        var appbanners = [add];
        // 如果其中一个文件存在，则执行更新操作
        try {
            if (deslImage) {
                add.url = deslImage.media_uri;
                add.md5 = deslImage.md5;
                add.filesize = deslImage.file_size;
            } else {
                message.error("请上传文件!");
            }

            // 执行数据更新操作
            var response = await grpcmarketImageInsert(appbanners, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(picturetableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");

            return;
        }
        setLoading(false);
    };
    // 表单重置

    const handleReturn = () => {
        goto(picturetableUrl);
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
                <LocationBar location={"Add"}/>
                <Stack direction={"row"} spacing={2}>
                    <TextFieldElement
                        name="sort"
                        label={t("sequenceNumber")}
                        type={"number"}
                    />
                </Stack>
                <SelectElement
                    size={"medium"}
                    label="是否启用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "200px",
                    }}
                />
                <Stack
                    direction={"row"}
                    spacing={5}
                    alignItems={"center"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={t("image")}
                        dir={"/apk/apkScri/" + Date.now().toString() + "/"}
                        setRes={setDeslImage}
                        file_type={"ott"}
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
