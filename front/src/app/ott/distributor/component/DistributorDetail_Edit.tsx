import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_DistributorDetailEdit, useproxy_DistributorDetailtableUrl,} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import LocationBar from "../../../../const/locationbar";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {DistributorDetail} from "../../../../api/fs/v1/fm_pb";
import {grpcDistributorDetailEdit} from "../api/grpcDistributorDetailEdit";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";
import Uploadfile from "../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {useproxy_DistributorValue, useproxy_ModelValue,} from "../../../../const/distributortomodel/store/store";

export const DistributorDetail_Edit = () => {
    // 获取编辑变量
    var DistributorDetail = useproxy_DistributorDetailEdit();
    // 获取DistributorDetailtable地址信息
    var DistributorDetailtableUrl = useproxy_DistributorDetailtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<DistributorDetail>({
        // 初始化表单数据
        defaultValues: {
            id: DistributorDetail.id,
            distributorId: DistributorDetail.distributorId,
            modelId: DistributorDetail.modelId,
            facebook: DistributorDetail.facebook,
            facebookImg: DistributorDetail.facebookImg,
            email: DistributorDetail.email,
            emailImg: DistributorDetail.emailImg,
            deleted: DistributorDetail.deleted,
        },
    });
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    // 上传返回数据
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();
    const [apkScriRes, setApkScriRes] = useState<UploadResponse>();
    // 表单提交时的回调函数
    // 提交表单
    const onSubmit = async (data: DistributorDetail) => {
        // 上传文件判断
        if (modelValue == "0" || !distributorValue || !modelValue) {
            message.error("分销商型号不能为空/0)");
            return;
        }
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        data.facebookImg = apkIconRes?.media_uri || DistributorDetail.facebookImg;
        data.emailImg = apkScriRes?.media_uri || DistributorDetail.emailImg;
        var response = await grpcDistributorDetailEdit(data, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(DistributorDetailtableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(DistributorDetailtableUrl);
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
                <LocationBar location={"编辑分销商账号"}/>
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
                    title={"编辑emailImage"}
                    dir={"/email/emailImage/" + Date.now().toString() + "/"}
                    setRes={setApkIconRes}
                    file_type={null}
                />
                <Uploadfile
                    title={"编辑fackbookImage"}
                    dir={"/facebook/fackbookImage/" + Date.now().toString() + "/"}
                    setRes={setApkScriRes}
                    file_type={null}
                />
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
