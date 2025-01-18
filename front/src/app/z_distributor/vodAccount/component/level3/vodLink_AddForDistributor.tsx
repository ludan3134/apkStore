import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import {VodLink} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {useproxy_VodLinkFilter} from "../../store/level3/store";
import {grpcDesktopLinkInsert} from "../../api/level3/grpcDesktopLinkInsert";
import {useproxy_Top10ManagerFilter, useproxy_Top10ManagerUrl} from "../../store/level1/store";


export const VodLinkLinkDistributor_AddForDistributor = () => {
    const {menuId, firstId, secondId} = useParams();
    var vodLink = useproxy_VodLinkFilter();

    // 请求是否成功
    var vodFilter = useproxy_Top10ManagerFilter();
    const {t} = useTranslation();
    var vodAccountUrl = useproxy_Top10ManagerUrl();

    const [loading, setLoading] = useState(false);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<VodLink>({});

    // 提交表单
    const onSubmit = async (data: VodLink) => {
        setLoading(true);
        data.distributorId = vodFilter.distributorId
        data.modelId = vodFilter.modelId
        data.classId = parseInt(firstId)
        data.vid = parseInt(secondId)
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcDesktopLinkInsert(authProxy.token, data);
            if (response.status) {
                message.success("success");
                goto(vodAccountUrl[3] + "/" + firstId + "/" + secondId);
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
        goto(vodAccountUrl[3] + "/" + firstId + "/" + secondId);
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
                <LocationBar location={"ADD"}/>
                <TextFieldElement name="season" label={t("season")} type={"number"}/>
                <TextFieldElement name="episode" label={t("episode")} type={"number"}/>
                <TextFieldElement name="link" label={t("link")}/>

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
//
