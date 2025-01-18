import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_RecommendEdit, useproxy_RecommendUrl,} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {grpcRecommendApkEdit} from "../api/grpcRecommendApkEdit";
import Uploadfile from "../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {RecommendApk} from "../../../../api/fs/v1/fm_pb";

export const RecommendApk_Edit = () => {
    // 获取编辑变量
    var RecommendEdit = useproxy_RecommendEdit();

    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_RecommendUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const [apkRecommend, setApkRecommend] = useState<UploadResponse>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<RecommendApk>({
        // 初始化表单数据
        defaultValues: {
            id: RecommendEdit.id,
            img: RecommendEdit.img,
            packageName: RecommendEdit.packageName,
            appName: RecommendEdit.appName,
            sort: RecommendEdit.sort,
            lang: RecommendEdit.lang,
        },
    });
    // 提交表单
    const onSubmit = async (data: RecommendApk) => {
        if (apkRecommend) {
            data.img = apkRecommend.media_uri;
        }
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcRecommendApkEdit(data, authProxy.token);
            if (response.status) {
                message.success("编辑成功");
                goto(xstreamtableUrl);
            }
        } catch (error) {
            message.error("调用接口失败");
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(xstreamtableUrl);
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
                <LocationBar location={"编辑XCRecommendApk"}/>
                <TextFieldElement name="packageName" label="包名" required/>
                <TextFieldElement name="appName" label="名称" required/>
                <TextFieldElement name="sort" label="排序" type={"number"} required/>

                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"ApkRecommend"}
                        dir={"/apkRecommend/" + Date.now().toString() + "/"}
                        setRes={setApkRecommend}
                        file_type={null}
                    />
                </Stack>
            </Stack>
            <DialogActions>
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
