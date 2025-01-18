import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useTranslation} from "react-i18next";
import {useproxy_DesktopImageEdit} from "../../../../../ott/desktopImage/store/store";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {AdvertisementPicture} from "../../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../../auth/store/store";
import {message} from "antd";
import {IsUploadFileReset} from "../../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import {useproxy_AdvertisementPicturetableUrl} from "../../store/level2/store";
import {grpcTVDeskImageEdit} from "../../../../../tv/TVdesktopImage/api/grpcTVDeskImageEdit";
import {IsBoolOption} from "../../../../../../const/option";

export const DeskImageForDistributor_Edit = () => {
    // 获取编辑变量
    var backgroundEdit = useproxy_DesktopImageEdit();
    // 获取addtable地址信息
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [deslImage, setDeslImage] = useState<UploadResponse>();
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const {t} = useTranslation();
    var picturetableUrl = useproxy_AdvertisementPicturetableUrl();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AdvertisementPicture>({
        // 初始化表单数据
        defaultValues: {
            id: backgroundEdit.id,
            version: backgroundEdit.version,
            md5: backgroundEdit.md5,
            url: backgroundEdit.url,
            content: backgroundEdit.content,
            filesize: backgroundEdit.filesize,
            distributorId: backgroundEdit.distributorId,
            modelId: backgroundEdit.modelId,
            isUse: backgroundEdit.isUse,
            created: backgroundEdit.created,
            updated: backgroundEdit.updated,
            deleted: backgroundEdit.deleted,
            modelName: backgroundEdit.modelName,
            distributorName: backgroundEdit.distributorName,
            sort: backgroundEdit.sort,
        },
    });

    // 提交表单
    const onSubmit = async (add: AdvertisementPicture) => {
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            if (deslImage) {
                add.url = deslImage.media_uri;
                add.md5 = deslImage.md5;
                add.filesize = deslImage.file_size;
            }

            // 执行数据更新操作
            var response = await grpcTVDeskImageEdit(add, authProxy.token);
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
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = false;
        setDeslImage(null);
        formContext.reset();
    };
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
                <LocationBar location={"Update"}/>
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
