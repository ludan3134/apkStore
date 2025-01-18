import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {grpcfirstEdit} from "../../api/first/grpcfirstEdit";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {DurationOption, IsBoolOption} from "../../../../../const/option";
import {useproxy_MainClassEdit, useproxy_MainClasstableUrl,} from "../../store/first/store";
import {MainClass} from "../../../../../api/ks/v1/km_pb";

export const First_Edit = () => {
    // 获取编辑变量
    var mainclass = useproxy_MainClassEdit();
    // 获取mainclasstable地址信息
    var mainclasstableUrl = useproxy_MainClasstableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // 分销商值
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MainClass>({
        // 初始化表单数据
        defaultValues: {
            id: mainclass.id,
            name: mainclass.name,
            zhName: mainclass.zhName,
            listName: mainclass.listName,
            probation: mainclass.probation,
            oneMonthPrice: mainclass.oneMonthPrice,
            threeMonthPrice: mainclass.threeMonthPrice,
            sixMonthPrice: mainclass.sixMonthPrice,
            nineMonthPrice: mainclass.nineMonthPrice,
            twelveMonthPrice: mainclass.twelveMonthPrice,
            description: mainclass.description,
            sort: mainclass.sort,
            isShow: mainclass.isShow,
            isCharge: mainclass.isCharge,
            price: mainclass.price,
            identity: mainclass.identity,
            comboId: mainclass.comboId,
            version: mainclass.version,
            //     增加:
            domain: mainclass.domain,
            configVersion: mainclass.configVersion,
            type: mainclass.type,
            appMaxBuffer: mainclass.appMaxBuffer,
            contentLatency: mainclass.contentLatency,
            streamMaxBuffer: mainclass.streamMaxBuffer,
            mpegtsCache: mainclass.mpegtsCache,
            interval: mainclass.interval,
            maxRetry: mainclass.maxRetry,
            timeout: mainclass.timeout,
            pullOnStart: mainclass.pullOnStart,
        },
    });

    // 提交表单
    const onSubmit = async (data: MainClass) => {
        console.log("data", data);
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcfirstEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
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
                <LocationBar location={"编辑一级分类"}/>
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
                <TextFieldElement name="oneMonthPrice" label="一个月价格"/>
                <TextFieldElement name="threeMonthPrice" label="三个月价格"/>
                <TextFieldElement name="sixMonthPrice" label="六个月价格"/>
                <TextFieldElement name="nineMonthPrice" label="九个月价格"/>
                <TextFieldElement name="twelveMonthPrice" label="十二个月价格"/>
                <TextFieldElement name="description" label="描述"/>
                <TextFieldElement name="price" label="价格"/>

                <TextFieldElement name="domain" label="播放域名"/>
                <TextFieldElement
                    name="configVersion"
                    label="配置版本号"
                    type={"number"}
                />
                <TextFieldElement name="type" label="类型"/>
                <TextFieldElement
                    name="appMaxBuffer"
                    label="appMaxBuffer"
                    type={"number"}
                />
                <TextFieldElement
                    name="contentLatency"
                    label="contentLatency"
                    type={"number"}
                />
                <TextFieldElement
                    name="streamMaxBuffer"
                    label="streamMaxBuffer"
                    type={"number"}
                />
                <TextFieldElement name="mpegtsCache" label="mpegtsCache"/>
                <TextFieldElement name="interval" label="interval" type={"number"}/>
                <TextFieldElement name="maxRetry" label="maxRetry" type={"number"}/>
                <TextFieldElement name="timeout" label="timeout" type={"number"}/>
                <TextFieldElement name="pullOnStart" label="pullOnStart"/>

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
