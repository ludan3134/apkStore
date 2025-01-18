import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {ProvideTemplate} from "../../../../../../api/tv_fs/v1/fm_pb";
import {message} from "antd";
import {authProxy} from "../../../../../auth/store/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import {useTranslation} from "react-i18next";
import {
    useproxy_ProvideTemplateEdit,
    useproxy_ProvideTemplatetableUrl,
} from "../../../../tv/deskImage/store/level1/store";
import {grpcUpdateProvideTemplate} from "../../../../tv/deskImage/api/level1/grpcUpdateProvideTemplate";

export const TVModelVideo_Edit = () => {
    // 获取编辑变量
    var provideTemplate = useproxy_ProvideTemplateEdit();
    // 获取ProvideTemplatetable地址信息
    var termianltableUrl = useproxy_ProvideTemplatetableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ProvideTemplate>({
        // 初始化表单数据
        defaultValues: {
            id: provideTemplate.id,
            distributorId: provideTemplate.distributorId,
            modelId: provideTemplate.modelId,
            aliasName: provideTemplate.aliasName,
            descriptionStore: provideTemplate.descriptionStore,
            descriptionAddPic: provideTemplate.descriptionAddPic,
            distributorName: provideTemplate.distributorName,
            modelName: provideTemplate.modelName,
        },
    });

    // 提交表单
    const onSubmit = async (data: ProvideTemplate) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcUpdateProvideTemplate(data, authProxy.token);
            if (response.status) {
                message.success("success");

                goto(termianltableUrl);
            }
        } catch (error) {
            message.error("error");

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
        goto(termianltableUrl);
    };
    const {t} = useTranslation();

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
                <LocationBar location={"EDIT"}/>
                <TextFieldElement name="aliasName" label={t("name")}/>
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
