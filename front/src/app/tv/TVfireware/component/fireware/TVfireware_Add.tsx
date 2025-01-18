import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";

import {initialTVFirewareParams, useproxy_TVFirewaretableUrl,} from "../../store/fireware/store";
import {grpcFirewareInsert} from "../../api/fireware/grpcFirewareInsert";
import {message} from "antd";
import {useNavigate} from "react-router-dom";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import DialogActions from "@mui/material/DialogActions";

export const TVFireware_Add = () => {
    // 获取TVFirewaretable地址信息
    var TVFirewaretableUrl = useproxy_TVFirewaretableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Firmware>({
        // 初始化表单数据
        defaultValues: initialTVFirewareParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (TVFireware: Firmware) => {
        setLoading(true);
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商及型号");

            setLoading(false);
            return;
        }
        TVFireware.distributorId = Distributorvalue;
        TVFireware.modelId = Modelvalue;
        try {
            // 执行数据插入操作
            var res = await grpcFirewareInsert(TVFireware, authProxy.token);
            if (res.status) {
                goto(TVFirewaretableUrl);
                message.success("添加成功");

                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
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
                <LocationBar location={"新增电视固件"}/>
                <TextFieldElement name="name" label="名称"/>
                <SelectElement
                    size={"medium"}
                    label="是否使用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                </Stack>
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
