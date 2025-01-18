import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {grpcInsertMowoClass} from "../../api/first/grpcInsertMowoClass";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {MowoClass} from "../../../../../api/ks/v1/km_pb";
import {initialMowoClassParams, useproxy_MowoClasstableUrl,} from "../../store/first/store";
import {useproxy_allXCombo} from "../../../../tvm/live/xc_combination/store/store";

export const MowoClass_Add = () => {
    // 获取编辑变量
    var mowoclasstableUrl = useproxy_MowoClasstableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MowoClass>({
        // 初始化表单数据
        defaultValues: initialMowoClassParams,
    });

    // 提交表单
    const onSubmit = async (data: MowoClass) => {
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcInsertMowoClass(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(mowoclasstableUrl);
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
        goto(mowoclasstableUrl);
    };
    var allXCombo = useproxy_allXCombo();


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
                <LocationBar location={"新增一级分类"}/>
                <TextFieldElement name="name" label="名称"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <SelectElement
                    label="套餐"
                    name="comboId"
                    options={allXCombo}
                    sx={{
                        minWidth: "180px",
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
