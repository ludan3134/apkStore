import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {XstreamCombo} from "../../../../../api/ks/v1/km_pb";
import {grpcXComboEdit} from "../api/grpcXComboEdit";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {useproxy_XComboEdit, useproxy_XCombotableUrl} from "../store/store";
import {useproxy_allXstream} from "../../xc_mapping/store/store";
import {message} from "antd";
import {DurationOptionWithOutDefault} from "../../../../../const/option";

export const Xcombination_Edit = () => {
    // 获取编辑变量
    var xcombo = useproxy_XComboEdit();
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_XCombotableUrl();
    console.log("xcombo", xcombo);
    console.log("xcombo.probation", xcombo.probation);
    // 请求是否成功
    var allxtream = useproxy_allXstream();

    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // const [timevalue, setTimevalue] = useState<string>(xcombo.probation)
    // const [timeunit, setTimeunit] = useState<string>("month")
    // const handletimeUnit = (newValue: string) => {
    //     console.log("newValue", newValue)
    //     setTimeunit(newValue)
    // }
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<XstreamCombo>({
        // 初始化表单数据
        defaultValues: {
            id: xcombo.id,
            name: xcombo.name,
            probation: xcombo.probation,
            oneMonthPrice: xcombo.oneMonthPrice,
            threeMonthPrice: xcombo.threeMonthPrice,
            sixMonthPrice: xcombo.sixMonthPrice,
            nineMonthPrice: xcombo.nineMonthPrice,
            twelveMonthPrice: xcombo.twelveMonthPrice,
            description: xcombo.description,
            sort: xcombo.sort,
            created: xcombo.created,
            updated: xcombo.updated,
            deleted: xcombo.deleted,
            xstreamResourceList: xcombo.xstreamResourceList,
            resourceIds: xcombo.resourceIds,
        },
    });

    // 提交表单
    const onSubmit = async (data: XstreamCombo) => {
        console.log("data", data);
        setLoading(true);

        // if (!data.probation.includes('day') && !data.probation.includes('month') && !data.probation.includes('year')) {
        //     // 如果不包含，则将timevalue和timeunit合并
        //     data.probation = timevalue + timeunit;
        // }

        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcXComboEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(xstreamtableUrl);
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
                <TextFieldElement name="name" label="XC套餐名称"/>
                <TextFieldElement name="probation" label="过期时间"/>
                <TextFieldElement name="oneMonthPrice" label="1月套餐价格"/>
                <TextFieldElement name="threeMonthPrice" label="3月套餐价格"/>
                <TextFieldElement name="sixMonthPrice" label="6月套餐价格"/>
                <TextFieldElement name="nineMonthPrice" label="9月套餐价格"/>
                <TextFieldElement name="twelveMonthPrice" label="12月套餐价格"/>
                {/*<TextFieldElement name="isStreamer" label="Xstream套餐ID" required/>*/}
                {/*<TextFieldElement name="isShowFlag" label="Xstream套餐ID" required/>*/}
                <TextFieldElement name="description" label="描述"/>
                <TextFieldElement name="sort" label="排序"/>
                <SelectElement
                    label="过期时间"
                    name="probation"
                    options={DurationOptionWithOutDefault}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                {/*<Input*/}
                {/*    defaultValue={xcombo.probation?.match(/^\d+/)?.[0]}*/}
                {/*    addonAfter={<Select*/}
                {/*        defaultValue={"month"}*/}
                {/*        style={{width: 120}}*/}
                {/*        options={[*/}
                {/*            {value: 'day', label: '天'},*/}
                {/*            {value: 'month', label: '月'},*/}
                {/*            {value: 'year', label: '年'},*/}
                {/*        ]}*/}
                {/*        onChange={handletimeUnit}*/}
                {/*    />} size={"large"}*/}
                {/*    onChange={e => setTimevalue(e.target.value)}/>*/}
                <MultiSelectElement
                    itemKey="id"
                    itemLabel="name"
                    label="XC资源Id"
                    name="resourceIds"
                    options={allxtream}
                    showChips={true}
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
