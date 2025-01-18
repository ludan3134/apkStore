import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {initialPricePlansfilterParams, useproxy_PricePlanstableUrl,} from "../store/store";
import {PricePlans} from "../../../../api/ws/v1/wm_pb";
import {grpcpriceplansInsert} from "../api/grpcpriceplansInsert";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

export const Priceplans_Add = () => {
    // 获取apktable地址信息
    var apktableUrl = useproxy_PricePlanstableUrl();
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
    const formContext = useForm<PricePlans>({
        // 初始化表单数据
        defaultValues: initialPricePlansfilterParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (data: PricePlans) => {
        data.distributorId = Distributorvalue;
        data.modelId = Modelvalue;
        // 上传文件判断
        try {
            // 执行数据插入操作
            var res = await grpcpriceplansInsert(data, authProxy.token);
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
                <LocationBar location={"新增价格套餐"}/>
                <TextFieldElement name="planName" label="planName" required/>
                <TextFieldElement
                    name="planDescription"
                    label="planDescription"
                    required
                />
                <TextFieldElement name="billingCycle" label="billingCycle" required/>
                <TextFieldElement name="trialPeriod" label="trialPeriod" required/>
                <TextFieldElement name="price" label="price" type={"number"} required/>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
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
