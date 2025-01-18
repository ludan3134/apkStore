import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTVApkdetailParams} from "../../store/apkversion/store";
import {grpcApkversionInsert} from "../../api/apkversion/grpcApkversionInsert";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {ApkDetail} from "../../../../../api/fs/v1/fm_pb";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";

export const TVApkversion_Add = () => {
    // 获取查看TVApk版本权限
    var permissions = authProxy.permissions;
    const TVApkversionTable = permissions.find(
        (option) => option.name === "查看电视APK版本",
    );
    // 获取到TVApkId 和 modelName 参数
    const {id, modelName} = useParams();
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
        goto(`${TVApkversionTable?.url}/${TVApkversionTable?.id}/${id}`);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkDetail>({
        // 初始化表单数据
        defaultValues: initialTVApkdetailParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (TVApkversion: ApkDetail) => {
        setLoading(true);
        console.log("modelName1", modelName);
        console.log("modelName1", id);
        TVApkversion.apkId = id;
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
                goto(`${TVApkversionTable?.url}/${TVApkversionTable?.id}/${id}`);
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
                <LocationBar location={"新增TVApk版本"}/>
                <TextFieldElement name="version" label="版本"/>
                <TextFieldElement name="content" label="内容"/>
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
                    label="是否删除"
                    name="status"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
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
