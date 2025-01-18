import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {grpcfirstInsert} from "../../api/first/grpcfirstInsert";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {DurationOption, IsBoolOption} from "../../../../../const/option";
import {initialMainClassParams, useproxy_MainClasstableUrl,} from "../../store/first/store";
import {MainClass} from "../../../../../api/ks/v1/km_pb";
import {useproxy_allXCombo} from "../../../live/xc_combination/store/store";

export const First_Add = () => {
    // 获取编辑变量
    var mainclasstableUrl = useproxy_MainClasstableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // const [timevalue, setTimevalue] = useState<string>()
    // const [timeunit, setTimeunit] = useState<string>("month")

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MainClass>({
        // 初始化表单数据
        defaultValues: initialMainClassParams,
    });

    // 提交表单
    const onSubmit = async (data: MainClass) => {
        console.log("data", data);
        setLoading(true);
        // if (!/^\d+$/.test(timevalue!)) {
        //     message.error("timevalue 必须是纯数字类型");
        //     return; // 如果 timevalue 不是纯数字，则不继续执行
        // }
        // data.probation = timevalue + timeunit

        try {
            // 执行数据更新操作
            var response = await grpcfirstInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(mainclasstableUrl);
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
        goto(mainclasstableUrl);
    };
    // const handletimeUnit = (newValue: string) => {
    //     console.log("newValue", newValue)
    //     setTimeunit(newValue)
    // }

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
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="zhName" label="中文名称" required/>
                <TextFieldElement name="listName" label="取列表名" required/>
                <SelectElement
                    label="过期时间"
                    name="probation"
                    options={DurationOption}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                <SelectElement
                    label="套餐"
                    name="comboId"
                    options={allXCombo}
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
                <TextFieldElement name="oneMonthPrice" label="一个月价格"/>
                <TextFieldElement name="threeMonthPrice" label="三个月价格"/>
                <TextFieldElement name="sixMonthPrice" label="六个月价格"/>
                <TextFieldElement name="nineMonthPrice" label="九个月价格"/>
                <TextFieldElement name="twelveMonthPrice" label="十二个月价格"/>
                <TextFieldElement name="description" label="描述"/>
                <TextFieldElement name="price" label="价格"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <SelectElement
                    size={"medium"}
                    label="是否展示"
                    name="isShow"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否收费"
                    name="isCharge"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
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
