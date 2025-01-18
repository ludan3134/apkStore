import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_XCaccountUrl} from "../store/store";
import {Channel, LabelResp, MacAccount} from "../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcXcaccountInsert} from "../api/grpcXcaccountInsert";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {DurationOptionWithOutDefault, platformTypeOption, usageOption,} from "../../../../const/option";
import {useproxy_allXCombo} from "../../live/xc_combination/store/store";
import {ThirdCalssStoreProxy} from "../../lscategories/store/third/store";
import {grpcAllSubClass} from "../../lscategories/api/third/grpcAllSubClass";
import {grpcAppName} from "../api/grpcAppName";

export const Xcaccount_Add = () => {
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_XCaccountUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<MacAccount>({
        // 初始化表单数据
        defaultValues: {
            id: 0,
            mac: "",
            distributorId: "",
            username: "",
            password: "",
            duration: "3day",
            expDate: 0,
            activationTime: 0,
            usage: 2,
            isExist: 0,
            remark: "",
            created: 0,
            platformType: 1,
        },
    });
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    React.useEffect(() => {
        formContext.reset()
        const fetchData = async () => {
            var res = await grpcAppName();
            setDataSource(res.appInfoList)
        };
        fetchData(); // 调用异步函数
    }, []);
    var allXCombo = useproxy_allXCombo();
    // 提交表单
    const onSubmit = async (data: MacAccount) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcXcaccountInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(xstreamtableUrl);
            }
        } catch (error) {
            message.error("调用接口失败");
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
                <LocationBar location={"添加XCMacAccount"}/>
                <TextFieldElement name="mac" label="mac"/>
                <TextFieldElement name="username" label="用户姓名,可不填,自动生成" placeholder={"可不填,自动生成"}/>
                <TextFieldElement name="password" label="用户密码,可不填,自动生成" placeholder={"可不填,自动生成"}/>
                <SelectElement
                    label="过期时间"
                    name="duration"
                    options={DurationOptionWithOutDefault}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="套餐"
                    name="comboId"
                    options={allXCombo}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="平台类型"
                    name="platformType"
                    options={platformTypeOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="用途"
                    name="usage"
                    options={usageOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
                <SelectElement
                    label="appName"
                    name="appId"
                    required={true}
                    options={dataSource}
                    sx={{
                        minWidth: "180px",
                    }}
                />
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
