import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import {useproxy_TVFirewareEdit, useproxy_TVFirewaretableUrl,} from "../../store/fireware/store";
import {grpcTVFirewareEdit} from "../../api/fireware/grpcTVFirewareEdit";
import {message} from "antd";
import {Firmware} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import DialogActions from "@mui/material/DialogActions";

export const TVFireware_Edit = () => {
    // 获取编辑变量
    var TVFireware = useproxy_TVFirewareEdit();
    // 获取TVFirewaretable地址信息
    var TVFirewaretableUrl = useproxy_TVFirewaretableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        TVFireware.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Firmware>({
        // 初始化表单数据
        defaultValues: {
            id: TVFireware.id,
            name: TVFireware.name,
            modelId: TVFireware.modelId,
            distributorId: TVFireware.distributorId,
            isUse: TVFireware.isUse,
        },
    });

    // 提交表单
    const onSubmit = async (data) => {
        setLoading(true);
        data.distributorId = Distributorvalue || TVFireware.distributorId;
        data.modelId = Modelvalue || TVFireware.modelId;
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcTVFirewareEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");

                goto(TVFirewaretableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");

            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        setDistributorvalue(null);
        setDistributorvalue(TVFireware.distributorId);
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(TVFirewaretableUrl);
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
                <LocationBar location={"编辑TVFireware"}/>
                <TextFieldElement name="name" label="名字"/>
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
