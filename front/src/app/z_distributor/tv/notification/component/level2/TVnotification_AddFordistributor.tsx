import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../../auth/store/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../../const/option";
import {useproxy_NotificationFilter, useproxy_NotificationtableUrl,} from "../../store/level2/store";
import {Notification} from "../../../../../../api/tv_fs/v1/fm_pb";
import {useTranslation} from "react-i18next";
import {grpcTvNotificationInsert} from "../../../../../tv/TVnotification/api/grpcTvNotificationInsert";
import ReactQuill from "react-quill";

export const TVnotification_AddFordistributor = () => {
    const {t} = useTranslation();

    // 获取编辑变量
    var notificationFilter = useproxy_NotificationFilter();
    // 获取notificationtable地址信息
    var notificationtableUrl = useproxy_NotificationtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Notification>({
        // 初始化表单数据
        defaultValues: {},
    });

    const [agreementText, setAgreementText] = useState<string>("");

    // 提交表单
    const onSubmit = async (data: Notification) => {
        console.log("data", data);
        console.log("agreementText", agreementText);
        // if (agreementText == '<p><br></p>' || agreementText == '') {
        //     message.error("请输入协议文本!")
        //     return
        // }
        const updatedAgreementText = agreementText.replace(/<\/p><p>/g, "<br>");

        if (updatedAgreementText === "<p><br></p>" || updatedAgreementText === "") {
            message.error("请输入协议文本!");
            return;
        }

        data.content = updatedAgreementText;
        data.distributorId = notificationFilter.distributorId;
        data.modelId = notificationFilter.modelId;
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcTvNotificationInsert(data, authProxy.token);
            if (response.status) {
                message.success("新增成功");

                goto(notificationtableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");
            setLoading(false);
            return;
        }
        goto(notificationtableUrl);
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(notificationtableUrl);
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
                <LocationBar location={"Add"}/>
                <TextFieldElement name="name" label={t("name")} required/>
                {/*<TextFieldElement name="content" label={t("content")} required/>*/}
                <SelectElement
                    size={"medium"}
                    label={t("isUse")}
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <ReactQuill
                    theme="snow"
                    value={agreementText}
                    onChange={setAgreementText}
                />
            </Stack>
            <DialogActions>
                <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={() => handleReturn()}
                >
                    <KeyboardReturnIcon color={"primary"}/>
                </IconButton>
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
