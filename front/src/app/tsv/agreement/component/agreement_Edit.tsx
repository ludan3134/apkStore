import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_AgreementEdit, useproxy_AgreementUrl} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {grpcAgreementEdit} from "../api/grpcAgreementEdit";
import {Agreement} from "../../../../api/ta/v1/tam_pb";
import {AgreementOption, IsBoolOption} from "../../../../const/option";
import LocationBar from "../../../../const/locationbar";
import ReactQuill from "react-quill";

export const Agreement_Edit = () => {
    // 获取编辑变量
    var AgreementEdit = useproxy_AgreementEdit();

    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_AgreementUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [agreementText, setAgreementText] = useState<string>(
        AgreementEdit.content,
    );

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Agreement>({
        // 初始化表单数据
        defaultValues: {
            id: AgreementEdit.id,
            title: AgreementEdit.title,
            content: AgreementEdit.content,
            lang: AgreementEdit.lang,
            type: AgreementEdit.type,
            isUse: AgreementEdit.isUse,
        },
    });

    // 提交表单
    const onSubmit = async (data: Agreement) => {
        setLoading(true);
        data.content = agreementText;
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcAgreementEdit(data, authProxy.token);
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
                <TextFieldElement name="title" label="标题" required/>
                <TextFieldElement name="lang" label="语言" required/>
                <SelectElement
                    label="类型"
                    name="type"
                    options={AgreementOption}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                <SelectElement
                    label="是否使用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <ReactQuill
                    theme="snow"
                    value={agreementText}
                    onChange={setAgreementText}
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
