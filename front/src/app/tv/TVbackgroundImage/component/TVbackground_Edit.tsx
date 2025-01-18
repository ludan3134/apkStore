import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {useproxy_TVBackgroundEdit, useproxy_TVBackgroundtableUrl,} from "../store/store";

import {grpcTVBackgroundEdit} from "../api/grpcTVBackgroundEdit";
import {message} from "antd";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Uploadfile from "../../../../const/uploadfile/uploadfile";

export const TVBackground_Edit = () => {
    // 获取编辑变量
    var TVBackgroundEdit = useproxy_TVBackgroundEdit();
    // 获取addtable地址信息
    var addtableUrl = useproxy_TVBackgroundtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const [TVBackgroundImage, setTVBackgroundImage] = useState<UploadResponse>();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<HomeBackgroundImage>({
        // 初始化表单数据
        defaultValues: {
            id: TVBackgroundEdit.id,
            version: TVBackgroundEdit.version,
            md5: TVBackgroundEdit.md5,
            url: TVBackgroundEdit.url,
            content: TVBackgroundEdit.content,
            filesize: TVBackgroundEdit.filesize,
            distributorId: TVBackgroundEdit.distributorId,
            modelId: TVBackgroundEdit.modelId,
            isUse: TVBackgroundEdit.isUse,
            created: TVBackgroundEdit.created,
            updated: TVBackgroundEdit.updated,
            deleted: TVBackgroundEdit.deleted,
            modelName: TVBackgroundEdit.modelName,
            distributorName: TVBackgroundEdit.distributorName,
        },
    });

    // 提交表单
    const onSubmit = async (TVBackgroundimage: HomeBackgroundImage) => {
        console.log("上传TVBackgroundImage", TVBackgroundImage);
        console.log("TVBackgroundimage", TVBackgroundimage);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        // 上传文件判断
        if (TVBackgroundImage) {
            console.log("我进来了", TVBackgroundImage.media_uri);
            console.log("我进来了", TVBackgroundImage.md5);
            console.log("我进来了", TVBackgroundImage.file_size);
            TVBackgroundimage.url = TVBackgroundImage.media_uri;
            TVBackgroundimage.md5 = TVBackgroundImage.md5;
            TVBackgroundimage.filesize = TVBackgroundImage.file_size;
        }
        console.log("赋值后TVBackgroundimage", TVBackgroundimage);

        try {
            // 执行数据更新操作
            var response = await grpcTVBackgroundEdit(
                TVBackgroundimage,
                authProxy.token,
            );
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

    // 返回上一级
    const handleReturn = () => {
        goto(addtableUrl);
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            onSuccess={(data) => {
                onSubmit(data);
            }}
        >
            {loading && <CircularIndeterminate/>}

            <Stack spacing={2}>
                <LocationBar location={"更新电视广告图片"}/>
                <Stack direction="row" spacing={2}>
                    <TextFieldElement name="sort" label="序号" type="number"/>
                </Stack>
                <Stack
                    direction="row"
                    spacing={5}
                    alignItems="center"
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"Background"}
                        dir={"/background/" + Date.now().toString() + "/"}
                        setRes={setTVBackgroundImage}
                        file_type={null}
                    />
                </Stack>
                <DialogActions>
                    {/*<Button variant="contained" size="large" onClick={() => handleReturn()}>*/}
                    {/*    返回上一级*/}
                    {/*</Button>*/}
                    <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        color="success"
                    >
                        提交
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        type="button"
                        onClick={() => handleResetForm()}
                        color="error"
                    >
                        重置
                    </Button>
                </DialogActions>
            </Stack>
        </FormContainer>
    );
};
