import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {initialPortalInfoParams, useproxy_PortalInfoEdit, useproxy_PortalInfotableUrl,} from "../store/store";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import {PortalInfo} from "../../../../api/asm/v1/asm_pb";
import {grpcPortalInfoInsert} from "../api/grpcServiceInsert";

export const PortalInfo_Add = () => {
    // 获取编辑变量
    var PortalInfo = useproxy_PortalInfoEdit();
    // 获取PortalInfotable地址信息
    var PortalInfotableUrl = useproxy_PortalInfotableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<PortalInfo>({
        // 初始化表单数据
        defaultValues: initialPortalInfoParams,
    });

    // 提交表单
    const onSubmit = async (data: PortalInfo) => {
        console.log("data", data);
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcPortalInfoInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(PortalInfotableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");
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
        goto(PortalInfotableUrl);
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
                <LocationBar location={"新增PortalInfo"}/>
                {/*<TextFieldElement name="provider" label="provider" required/>*/}
                <TextFieldElement name="serviceType" label="serviceType" required/>
                <TextFieldElement name="serviceUrl" label="serviceUrl" required/>
                <TextFieldElement name="baseUrl" label="baseUrl" required/>
                <SelectElement
                    size={"medium"}
                    label="是否服务"
                    name="isService"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
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
