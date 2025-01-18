import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {grpcAppUserInsert} from "../api/grpcAppUserInsert";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {initialAppUserfilterParams, useproxy_AppUsertableUrl,} from "../store/store";
import {AppUser} from "../../../../api/ws/v1/wm_pb";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {IsBoolOption} from "../../../../const/option";

export const AppUser_Add = () => {
    // 获取appUsertable地址信息
    var appUsertableUrl = useproxy_AppUsertableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const formContext = useForm<AppUser>({
        // 初始化表单数据
        defaultValues: initialAppUserfilterParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (data: AppUser) => {
        // 上传文件判断
        data.password = "123456";
        data.ip = "127.0.0.1:3001";
        data.country = "中国";
        data.city = "深圳";
        data.distributorId = Distributorvalue;
        data.modelId = Modelvalue;
        const now = new Date();
        const formattedDate = now.toISOString().replace("T", " ").substring(0, 19);
        data.lastLogin = formattedDate;
        data.operator = "Chinanet";
        try {
            // 执行数据插入操作
            var res = await grpcAppUserInsert(data, authProxy.token);
            if (res.status) {
                setLoading(false);
                message.success("插入数据成功");
                handleResetForm();
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
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
                <LocationBar location={"新增App用户"}/>
                <TextFieldElement name="userName" label="用户名称" required/>
                <TextFieldElement name="mac" label="Mac地址" required/>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
                <SelectElement
                    size={"medium"}
                    label="是否服务"
                    name="isService"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "200px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否激活"
                    name="isActive"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "200px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否过期"
                    name="isExpired"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "200px",
                    }}
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
