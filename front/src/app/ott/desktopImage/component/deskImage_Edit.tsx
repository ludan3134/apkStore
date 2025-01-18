import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {grpcDeskImageEdit} from "../api/grpcDeskImageEdit";
import {useproxy_DesktopImageEdit, useproxy_DesktopImagetableUrl,} from "../store/store";
import {message} from "antd";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Uploadfile from "../../../../const/uploadfile/uploadfile";
import {useTranslation} from "react-i18next";

export const DeskImage_Edit = () => {
    // 获取编辑变量
    var backgroundEdit = useproxy_DesktopImageEdit();
    // 获取addtable地址信息
    var addtableUrl = useproxy_DesktopImagetableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [deslImage, setDeslImage] = useState<UploadResponse>();
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const {t} = useTranslation();

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
            var response = await grpcDeskImageEdit(add, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(addtableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");

            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        formContext.reset();
    };
    const handleReturn = () => {
        goto(addtableUrl);
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
                </Stack>
                <Stack
                    direction={"row"}
                    spacing={5}
                    alignItems={"center"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"DeskImage"}
                        dir={"/deskImage/" + Date.now().toString() + "/"}
                        setRes={setDeslImage}
                        file_type={null}
                    />
                </Stack>
            </Stack>
            <DialogActions>
                {/*<Button variant="contained" size="large" onClick={() => handleReturn()}>*/}
                {/*    返回上一级*/}
                {/*</Button>*/}
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
