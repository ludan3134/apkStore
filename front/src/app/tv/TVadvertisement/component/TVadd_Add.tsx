import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextareaAutosizeElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTVAddParams, useproxy_TVAddtableUrl} from "../store/store";
import {grpcAddInsert} from "../api/grpcAddInsert";
import {message} from "antd";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import Uploadfile from "../../../../const/uploadfile/uploadfile";

export const TVAdd_Add = () => {
    // 获取TVAddtable地址信息
    var TVAddtableUrl = useproxy_TVAddtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 上传TVAddfile
    const [TVAddfileRes, setTVAddfileRes] = useState<UploadResponse>();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Advertisement>({
        // 初始化表单数据
        defaultValues: initialTVAddParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (TVAdd: Advertisement) => {
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商及型号");

            setLoading(false);
            return;
        }
        TVAdd.distributorId = Distributorvalue;
        TVAdd.modelId = Modelvalue;
        setLoading(true);
        if (!TVAddfileRes) {
            message.error("请上传图片");
            setLoading(false);
            return;
        }
        TVAdd.url = TVAddfileRes.media_uri;
        TVAdd.md5 = TVAddfileRes.md5;
        TVAdd.filesize = TVAddfileRes.file_size;
        try {
            var res = await grpcAddInsert(TVAdd, authProxy.token);
            if (res.status) {
                goto(TVAddtableUrl);
                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        setDistributorvalue(null);
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
                <LocationBar location={"新增TVAdd"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="playTime" label="播放时间" required/>
                <TextFieldElement name="version" label="版本" required/>
                <TextareaAutosizeElement name="content" label="内容"/>
                <TextFieldElement name="type" label="类型"/>
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                </Stack>
                <Stack
                    direction={"row"}
                    spacing={5}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Stack spacing={2} direction={"column"} alignItems={"center"}>
                        <Uploadfile
                            title={"TVAdd"}
                            dir={"/add/" + Date.now().toString() + "/"}
                            setRes={setTVAddfileRes}
                            file_type={"tv"}
                        />
                    </Stack>
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
