import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_AppUserEdit, useproxy_AppUsertableUrl} from "../store/store";
import {AppUser} from "../../../../api/ws/v1/wm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcAppUserEdit} from "../api/grpcAppUserEdit";
import LocationBar from "../../../../const/locationbar";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {IsBoolOption} from "../../../../const/option";

export const AppUser_Edit = () => {
    // 获取编辑变量
    var appUser = useproxy_AppUserEdit();
    // 获取appUsertable地址信息
    var appUsertableUrl = useproxy_AppUsertableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        appUser.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>(appUser.modelId);
    // 分销商值
    const formContext = useForm<AppUser>({
        // 初始化表单数据
        defaultValues: {
            userName: appUser.userName,
            password: appUser.password,
            mac: appUser.mac,
            ip: appUser.ip,
            country: appUser.country,
            city: appUser.city,
            distributorId: appUser.distributorId,
            modelId: appUser.modelId,
            distributorName: appUser.distributorName,
            modelName: appUser.modelName,
            lastLogin: appUser.lastLogin,
            operator: appUser.operator,
            isService: appUser.isService,
            isActive: appUser.isActive,
            isExpired: appUser.isExpired,
        },
    });

    // 提交表单
    const onSubmit = async (appUser: AppUser) => {
        appUser.distributorId = Distributorvalue;
        appUser.modelId = Modelvalue;
        var response = await grpcAppUserEdit(appUser, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(appUsertableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(appUsertableUrl);
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
                <LocationBar location={"编辑appUser"}/>
                <TextFieldElement name="userName" label="用户名称" required/>
                <TextFieldElement name="password" label="用户密码" required/>
                <TextFieldElement name="mac" label="Mac地址" required/>
                <TextFieldElement name="ip" label="Mac地址" required/>
                <TextFieldElement name="country" label="国家" required/>
                <TextFieldElement name="city" label="城市" required/>
                {/*<TextFieldElement name="distributorId" label="分销商ID" required/>*/}
                {/*<TextFieldElement name="modelId" label="型号ID" required/>*/}
                <TextFieldElement name="distributorName" label="分销商名称" required/>
                <TextFieldElement name="modelName" label="型号名称" required/>
                <TextFieldElement name="operator" label="运营商" required/>
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
