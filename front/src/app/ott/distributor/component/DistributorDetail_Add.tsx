import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {initialDistributorDetailfilterParams, useproxy_DistributorDetailtableUrl,} from "../store/store";
import LocationBar from "../../../../const/locationbar";
import {DistributorDetail} from "../../../../api/fs/v1/fm_pb";
import {grpcDistributorDetailInsert} from "../api/grpcDistributorDetailInsert";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";
import Uploadfile from "../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";

export const DistributorDetail_Add = () => {
    // 获取DistributorDetailtable地址信息
    var DistributorDetailtableUrl = useproxy_DistributorDetailtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const formContext = useForm<DistributorDetail>({
        // 初始化表单数据
        defaultValues: initialDistributorDetailfilterParams,
    });
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    // 上传返回数据
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();
    const [apkScriRes, setApkScriRes] = useState<UploadResponse>();
    // 表单提交时的回调函数
    const onSubmit = async (data: DistributorDetail) => {
        // 上传文件判断
        if (modelValue == "0" || !distributorValue || !modelValue) {
            message.error("分销商型号不能为空/0)");
            return;
        }
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        if (!apkIconRes || !apkScriRes) {
            message.error("请选中fackbook头像图片和email图片");
            setLoading(false);
            return;
        }
        data.facebookImg = apkScriRes?.media_uri;
        data.emailImg = apkIconRes?.media_uri;
        try {
            // 执行数据插入操作
            var res = await grpcDistributorDetailInsert(data, authProxy.token);
            if (res.code === 2000) {
                setLoading(false);
                message.success("插入数据成功");
                handleResetForm();
            } else {
                message.error(res.message);
                return;
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        IsUploadFileReset.IsReset = false;
        setApkScriRes(null);
        setApkIconRes(null);
        DistributorInputStoreProxy.DistributorValue = "";
        DistributorInputStoreProxy.ModelValue = "";
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
                <LocationBar location={"新增分销商账号"}/>
                <TextFieldElement name="facebook" label="facebook账号" required/>
                <TextFieldElement name="email" label="email" required/>
                <Distributor2Model></Distributor2Model>
            </Stack>
            <Stack
                spacing={5}
                direction={"row"}
                alignItems={"flex-end"}
                divider={<Divider orientation="vertical" flexItem/>}
            >
                <Uploadfile
                    title={"新增emailImage"}
                    dir={"/email/emailImage/" + Date.now().toString() + "/"}
                    setRes={setApkIconRes}
                    file_type={null}
                />
                <Uploadfile
                    title={"新增fackbookImage"}
                    dir={"/facebook/fackbookImage/" + Date.now().toString() + "/"}
                    setRes={setApkScriRes}
                    file_type={null}
                />
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
