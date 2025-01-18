import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_PricePlansEdit, useproxy_PricePlanstableUrl,} from "../store/store";
import {PricePlans} from "../../../../api/ws/v1/wm_pb";
import {authProxy} from "../../../auth/store/store";
import LocationBar from "../../../../const/locationbar";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {grpcpriceplansEdit} from "../api/grpcpriceplansEdit";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

export const PricePlans_Edit = () => {
    // 获取编辑变量
    var priceplans = useproxy_PricePlansEdit();
    // 获取priceplanstable地址信息
    var priceplanstableUrl = useproxy_PricePlanstableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        priceplans.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>(priceplans.modelId);
    // 分销商值
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<PricePlans>({
        // 初始化表单数据
        defaultValues: {
            id: priceplans.id,
            planName: priceplans.planName,
            planDescription: priceplans.planDescription,
            billingCycle: priceplans.planDescription,
            trialPeriod: priceplans.trialPeriod,
            price: priceplans.price,
        },
    });

    // 提交表单
    const onSubmit = async (priceplans: PricePlans) => {
        priceplans.distributorId = Distributorvalue;
        priceplans.modelId = Modelvalue;
        var response = await grpcpriceplansEdit(priceplans, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(priceplanstableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(priceplanstableUrl);
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
                <LocationBar location={"编辑价格套餐"}/>
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
