import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {useproxy_ServerConfigEdit, useproxy_ServerConfigtableUrl,} from "../store/store";
import {message} from "antd";
import {grpcServerConfigEdit} from "../api/grpcServiceEdit";
import {ServerConfig} from "../../../api/ax/v1/axm_pb";
import CircularIndeterminate from "../../../const/alert/circularIndeterminate";
import LocationBar from "../../../const/locationbar";
import {AddrOption, IsBoolOption} from "../../../const/option";
import {authProxy} from "../../auth/store/store";

export const ServerConfig_Edit = () => {
    // 获取编辑变量
    var ServerConfig = useproxy_ServerConfigEdit();
    // 获取ServerConfigtable地址信息
    var ServerConfigtableUrl = useproxy_ServerConfigtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // 分销商值
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ServerConfig>({
        // 初始化表单数据
        defaultValues: {
            id: ServerConfig.id,
            domain: ServerConfig.domain,
            addrType: ServerConfig.addrType,
            isUse: ServerConfig.isUse,
            createAt: ServerConfig.createAt,
            updateAt: ServerConfig.updateAt,
        },
    });

    // 提交表单
    const onSubmit = async (data: ServerConfig) => {
        console.log("data", data);
        setLoading(true);

        try {
            // 执行数据更新操作
            var response = await grpcServerConfigEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(ServerConfigtableUrl);
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
        goto(ServerConfigtableUrl);
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
                <LocationBar location={"编辑ServerConfig"}/>
                {/*<TextFieldElement name="provider" label="provider" required/>*/}
                <TextFieldElement name="domain" label="服务地址"/>
                <SelectElement
                    size={"medium"}
                    label="地址类型"
                    name="addrType"
                    options={AddrOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否使用"
                    name="isUse"
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
