import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTerminalParams, useproxy_TerminaltableUrl,} from "../store/store";

import {message} from "antd";
import {TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import {addColonsToMacAddress, validateMacAddress,} from "../../../../const/validateMac";
import {grpTerminalInsert} from "../api/grpTerminalInsert";
import {authProxy} from "../../../auth/store/store";
import {
    Distributor2lotProxy,
    useDistributorlist,
    usefilterlot,
} from "../../../../const/distributor2lot/distributor2lot";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import {IsBoolOption} from "../../../../const/option";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

export const Terminal_Add = () => {
    // 获取accounttable地址信息
    var termianltableUrl = useproxy_TerminaltableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<TerminalInfo>({
        // 初始化表单数据
        defaultValues: initialTerminalParams,
    });

    // 提交表单
    const onSubmit = async (data: TerminalInfo) => {
        if (validateMacAddress(data.macString)) {
            data.macString = addColonsToMacAddress(data.macString);
        } else {
            message.error("mac地址输入格式不正确");

            handleResetForm();
        }
        if (!Distributorvalue || !Modelvalue) {
            message.error("请选中分销商及型号");
            setLoading(false);
            return;
        }
        data.distributorId = Distributorvalue;
        data.modelId = Modelvalue;

        console.log("data.macString", data.macString);
        setLoading(true);
        // 如果其中一个文件存在，则执行新增操作
        try {
            // 执行数据新增操作
            var response = await grpTerminalInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(termianltableUrl);
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
        goto(termianltableUrl);
    };
    // 关于distributor to lots
    useEffect(() => {
        formContext.resetField("lotId", {defaultValue: ""});
        Distributor2lotProxy.filterLots = Distributor2lotProxy.lots.filter(
            (lot) => lot.distributorId === Distributorvalue,
        );
    }, [Distributorvalue]);
    const distributors = useDistributorlist();
    var lotLabels = usefilterlot();
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
                <LocationBar location={"新增终端"}/>
                {/*<TextFieldElement name="chipIdentity" label="芯片id" />*/}
                <TextFieldElement name="macString" label="mac地址" required/>
                <TextFieldElement name="serial" label="Sn码"/>
                <TextFieldElement name="activeCode" label="激活码"/>
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                    <SelectElement
                        name="lotId"
                        label={"批次号"}
                        options={lotLabels}
                        required={true}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        label="设置激活状态"
                        name="setActive"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="设置服务状态"
                        name="setService"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="设置市场授权状态"
                        name="storeAuth"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                </Stack>
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
