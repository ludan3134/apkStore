import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useproxy_LotEdit, useproxy_LottableUrl} from "../store/store";
import {grpcLotEdit} from "../api/grpcLotEdit";
import {message} from "antd";
import {Lot} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";

export const Lot_Edit = () => {
    // 获取编辑变量
    var lot = useproxy_LotEdit();
    // 获取lottable地址信息
    var lottableUrl = useproxy_LottableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Lot>({
        // 初始化表单数据
        defaultValues: {
            id: lot.id,
            distributorId: lot.distributorId,
            title: lot.title,
            distributorName: lot.distributorName,
        },
    });

    // 提交表单
    const onSubmit = async (data: Lot) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcLotEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(lottableUrl);
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
        goto(lottableUrl);
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
                <LocationBar location={"编辑生产批次"}/>
                <TextFieldElement name="title" label="生产批次号" required/>
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
