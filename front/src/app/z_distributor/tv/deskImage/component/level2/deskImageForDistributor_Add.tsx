import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useTranslation} from "react-i18next";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {AdvertisementPicture} from "../../../../../../api/fs/v1/fm_pb";
import {
    initialAdvertisementPictureParams,
    useproxy_AdvertisementPictureFilter,
    useproxy_AdvertisementPicturetableUrl,
} from "../../store/level2/store";
import {authProxy} from "../../../../../auth/store/store";
import {grpcTVDeskImageInsert} from "../../../../../tv/TVdesktopImage/api/grpcTVDeskImageInsert";
import LocationBar from "../../../../../../const/locationbar";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";
import {IsBoolOption} from "../../../../../../const/option";

export const DeskImageForDistributor_Add = () => {
    const {t} = useTranslation();
    // 获取apktable地址信息
    var picturetableUrl = useproxy_AdvertisementPicturetableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    var pictureFilter = useproxy_AdvertisementPictureFilter();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AdvertisementPicture>({
        // 初始化表单数据
        defaultValues: initialAdvertisementPictureParams,
    });

    // 上传返回数据
    const [deslImage, setDeslImage] = useState<UploadResponse>();

    // 使用 useForm 声明一个 formContext
    // 表单提交时的回调函数
    const onSubmit = async (add: AdvertisementPicture) => {
        add.distributorId = pictureFilter.distributorId;
        add.modelId = pictureFilter.modelId;
        setLoading(true);
        if (!deslImage) {
            message.error(t("Please upload an image"));
            setLoading(false);
            return;
        } else {
            add.url = deslImage.media_uri;
            add.md5 = deslImage.md5;
            add.filesize = deslImage.file_size;
        }
        // 分销商型号判断
        // 上传文件判断
        // 上传文件判断
        try {
            var images = [add];
            // 执行数据插入操作
            var res = await grpcTVDeskImageInsert(images, authProxy.token);
            if (res.status) {
                setLoading(false);
                message.success("SUCCESS");
                setDeslImage(null);
                handleResetForm();
                goto(picturetableUrl);
            }
        } catch (error) {
            message.error("ERROR");
        }
        setLoading(false);
    };
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = false;
        setDeslImage(null);
        formContext.reset();
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
                    <SelectElement
                        size={"medium"}
                        label="是否启用"
                        name="isUse"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "200px",
                        }}
                    />
                </Stack>
                <Stack
                    direction={"row"}
                    spacing={5}
                    alignItems={"center"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={t("image")}
                        dir={"/deskImage/" + Date.now().toString() + "/"}
                        setRes={setDeslImage}
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
