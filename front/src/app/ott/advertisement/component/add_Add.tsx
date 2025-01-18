import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";

import {useNavigate} from "react-router-dom";
import {grpcAddInsert} from "../api/grpcAddInsert";
import DialogActions from "@mui/material/DialogActions";

import {initialAddParams, useproxy_AddtableUrl} from "../store/store";

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

export const Add_Add = () => {
    // 获取addtable地址信息
    var addtableUrl = useproxy_AddtableUrl();
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
    // 上传Addfile
    const [addfileRes, setAddfileRes] = useState<UploadResponse>();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Advertisement>({
        // 初始化表单数据
        defaultValues: initialAddParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (add: Advertisement) => {
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选择分销商!");
            setLoading(false);
            return;
        }
        add.distributorId = Distributorvalue;
        add.modelId = Modelvalue;
        setLoading(true);
        if (!addfileRes) {
            message.error("请上传广告图片");
            setLoading(false);
            return;
        }
        add.url = addfileRes.media_uri;
        add.md5 = addfileRes.md5;
        add.filesize = addfileRes.file_size;
        try {
            var res = await grpcAddInsert(add, authProxy.token);
            if (res.status) {
                message.success("添加成功成功!");
                goto(addtableUrl);
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
                <LocationBar location={"新增add"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="playTime" label="播放时间" required/>
                <TextFieldElement name="version" label="版本" required/>
                <TextFieldElement name="content" label="内容"/>
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
                            title={"Add"}
                            dir={"/add/" + Date.now().toString() + "/"}
                            setRes={setAddfileRes}
                            file_type={null}
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
