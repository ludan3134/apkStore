import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {grpcUpdateVodAccount} from "../../api/level1/grpcUpdateVodAccount";
import {authProxy} from "../../../../auth/store/store";
import {message} from "antd";
import {useTranslation} from "react-i18next";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Distributor2Model from "../../../../../const/distributortomodel/component/distributor2model";
import {useproxy_DistributorValue, useproxy_ModelValue} from "../../../../../const/distributortomodel/store/store";
import {
    useproxy_Top10ManagerAllClass,
    useproxy_Top10ManagerEdit,
    useproxy_Top10ManagerUrl
} from "../../store/level1/store";
import {Top10Manager} from "../../../../../api/ks/v1/km_pb";


export const TVModelVodAccount_Edit = () => {
    // 获取编辑变量
    var provideTemplate = useproxy_Top10ManagerEdit();
    // 获取ProvideTemplatetable地址信息
    var termianltableUrl = useproxy_Top10ManagerUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    var vodClassLabels = useproxy_Top10ManagerAllClass();

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Top10Manager>({
        // 初始化表单数据
        defaultValues: {
            id: provideTemplate.id,
            distributorId: provideTemplate.distributorId,
            modelId: provideTemplate.modelId,
            comboId: provideTemplate.comboId,
            created: provideTemplate.created,
            updated: provideTemplate.updated,
            deleted: provideTemplate.deleted,
            aliasName: provideTemplate.aliasName,
            distributorName: provideTemplate.distributorName,
            modelName: provideTemplate.modelName,
            comboName: provideTemplate.comboName,
        },
    });

    // 提交表单
    const onSubmit = async (data: Top10Manager) => {
        console.log("data", data);
        setLoading(true);
        if (modelValue == "0" || !distributorValue || !modelValue) {
            message.error("分销商型号不能为空");
            setLoading(false);

            return;
        }
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcUpdateVodAccount(data, authProxy.token);
            if (response.status) {
                message.success("success");
                goto(termianltableUrl[0]);
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
        goto(termianltableUrl[0]);
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
                <TextFieldElement name="aliasName" label={t("aliasName")}/>

                <SelectElement
                    label={t("package Name")}
                    name="comboId"
                    options={vodClassLabels}
                    sx={{
                        minWidth: '180px'
                    }}
                    required={true}
                />
                <Distributor2Model/>
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
