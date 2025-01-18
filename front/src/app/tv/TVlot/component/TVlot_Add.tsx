import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTVLotPartv_tv_asm, useproxy_TVLottableUrl,} from "../store/store";

import {grpcLotInsert} from "../api/grpcLotInsert";
import {message} from "antd";
import {Lot} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";

export const TVLot_Add = () => {
    // 获取TVLottable地址信息
    var TVLottableUrl = useproxy_TVLottableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    const [Distributorvalue, setDistributorvalue] = useState<String>();

    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Lot>({
        // 初始化表单数据
        defaultValues: initialTVLotPartv_tv_asm,
    });

    // 提交表单
    const onSubmit = async (data: Lot) => {
        console.log("data", data);
        if (Distributorvalue == null) {
            message.error("请选中分销商");

            setLoading(false);
            return;
        }
        data.distributorId = Distributorvalue;
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcLotInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");

                goto(TVLottableUrl);
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
        goto("/");
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
                <LocationBar location={"新增电视生产批次"}/>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
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
