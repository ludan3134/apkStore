import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {XstreamCombo} from "../../../../../api/ks/v1/km_pb";
import {grpcXComboInsert} from "../api/grpcXComboInsert";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {initialXComboParams, useproxy_XCombotableUrl} from "../store/store";
import {message} from "antd";
import {useproxy_allXstream} from "../../xc_mapping/store/store";
import {DurationOptionWithOutDefault} from "../../../../../const/option";

export const Xcombination_Add = () => {
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_XCombotableUrl();
    var allxtream = useproxy_allXstream();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // const [timevalue, setTimevalue] = useState<string>()
    // const [timeunit, setTimeunit] = useState<string>("month")
    // const handletimeUnit = (newValue: string) => {
    //     console.log("newValue", newValue)
    //     setTimeunit(newValue)
    // }
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<XstreamCombo>({
        // 初始化表单数据
        defaultValues: initialXComboParams,
    });
    // 提交表单
    const onSubmit = async (data: XstreamCombo) => {
        // console.log("data", data)
        // if (!/^\d+$/.test(timevalue!)) {
        //     message.error("timevalue 必须是纯数字类型");
        //     return; // 如果 timevalue 不是纯数字，则不继续执行
        // }
        // data.probation = timevalue + timeunit
        //
        // console.log("timevalue", timevalue + timeunit)
        // data.probation += data.Timeunit
        console.log(data.probation);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcXComboInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功!");
                // goto(xstreamtableUrl);
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
        goto(xstreamtableUrl);
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
                <LocationBar location={"编辑xstream"}/>
                <TextFieldElement name="name" label="XC套餐名称" required={true}/>
                <TextFieldElement name="oneMonthPrice" label="1月套餐价格"/>
                <TextFieldElement name="threeMonthPrice" label="3月套餐价格"/>
                <TextFieldElement name="sixMonthPrice" label="6月套餐价格"/>
                <TextFieldElement name="nineMonthPrice" label="9月套餐价格"/>
                <TextFieldElement name="twelveMonthPrice" label="12月套餐价格"/>
                <SelectElement
                    label="过期时间"
                    name="probation"
                    options={DurationOptionWithOutDefault}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                {/*<Input addonAfter={<Select*/}
                {/*    defaultValue={"month"}*/}
                {/*    style={{width: 120}}*/}
                {/*    options={[*/}
                {/*        {value: 'day', label: '天'},*/}
                {/*        {value: 'month', label: '月'},*/}
                {/*        {value: 'year', label: '年'},*/}
                {/*    ]}*/}
                {/*    onChange={handletimeUnit}*/}
                {/*/>} size={"large"}*/}
                {/*       onChange={e => setTimevalue(e.target.value)}/>*/}
                <MultiSelectElement
                    itemKey="id"
                    itemLabel="name"
                    label="XC资源Id"
                    name="resourceIds"
                    options={allxtream}
                    showChips={true}
                />
                {/*<Stack spacing={2} direction={"row"}>*/}
                {/*    <TextFieldElement name="probation" label="过期时间" required type={"number"}/>*/}
                {/*    <SelectElement*/}
                {/*        label="时间单位"*/}
                {/*        name="Timeunit"*/}
                {/*        options={[*/}
                {/*            {*/}
                {/*                id: 'year',*/}
                {/*                label: '年'*/}
                {/*            },*/}
                {/*            {*/}
                {/*                id: 'month',*/}
                {/*                label: '月'*/}
                {/*            },*/}
                {/*            {*/}
                {/*                id: 'day',*/}
                {/*                label: '月'*/}
                {/*            }*/}
                {/*        ]}*/}
                {/*        sx={{*/}
                {/*            minWidth: '275px'*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Stack>*/}

                {/*<TextFieldElement name="isStreamer" label="Xstream套餐ID" required/>*/}
                {/*<TextFieldElement name="isShowFlag" label="Xstream套餐ID" required/>*/}
                <TextFieldElement name="description" label="描述"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
            </Stack>
            <DialogActions>
                {/*<IconButton aria-label="delete" size="large" onClick={() => handleReturn()}>*/}
                {/*    <KeyboardReturnIcon color={"primary"}/>*/}
                {/*</IconButton>*/}
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
