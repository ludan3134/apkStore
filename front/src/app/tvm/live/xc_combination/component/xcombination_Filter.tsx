import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {XstreamCombo} from "../../../../../api/ks/v1/km_pb";
import {XCombotoreProxy} from "../store/store";
import {useproxy_allXstream} from "../../xc_mapping/store/store";

export const Xcombination_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<XstreamCombo>({
        defaultValues: {},
    });
    var allxtream = useproxy_allXstream();

    const handleSubFormSubmit = (data: XstreamCombo) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;
        console.log("data", data);
        XCombotoreProxy.XComboFilter = data;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        XCombotoreProxy.XComboFilter = {} as XstreamCombo;
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem/>}
            >

                <TextFieldElement name="name" label="套餐名称"/>
                <TextFieldElement name="comboType" label="类型"/>

                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};
