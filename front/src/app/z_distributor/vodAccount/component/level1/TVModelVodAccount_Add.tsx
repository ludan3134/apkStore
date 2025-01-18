import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useTranslation} from "react-i18next";
import {grpcAddVodAccount} from "../../api/level1/grpcAddVodAccount";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {useproxy_Top10ManagerAllClass, useproxy_Top10ManagerUrl} from "../../store/level1/store";
import {Top10Manager} from "../../../../../api/ks/v1/km_pb";

export const TVModelVodAccount_Add = () => {
    const {t} = useTranslation();

    // 获取VodAccounttable地址信息
    var accountUrl = useproxy_Top10ManagerUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // 声明路由跳转
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 跳转路由
    var vodClassLabels = useproxy_Top10ManagerAllClass();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Top10Manager>({
        // 初始化表单数据
        defaultValues: {},
    });

    // 提交表单
    const onSubmit = async (data: Top10Manager) => {
        console.log("data", data);
        if (!Distributorvalue || !Modelvalue) {
            message.error("请选中分销商及型号");
            setLoading(false);
            return;
        }
        data.distributorId = Distributorvalue;
        data.modelId = Modelvalue;
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcAddVodAccount(data, authProxy.token);
            if (response.status) {
                message.success("success");
                goto(accountUrl[0]);
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
        setDistributorvalue(null);
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(accountUrl[0]);
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

                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
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
