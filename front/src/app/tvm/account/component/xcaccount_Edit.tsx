import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_XCaccountEdit, useproxy_XCaccountUrl} from "../store/store";
import {LabelResp, MacAccount} from "../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {DurationOption, platformTypeOption, usageOption,} from "../../../../const/option";
import {useproxy_allXCombo} from "../../live/xc_combination/store/store";
import {grpcXCAccountEdit} from "../api/grpcXCAccountEdit";
import {grpcAppName} from "../api/grpcAppName";

export const Xcaccount_Edit = () => {
    // 获取编辑变量
    var xCaccountEdit = useproxy_XCaccountEdit();

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
            id: xCaccountEdit.id,
            mac: xCaccountEdit.mac,
            distributorId: xCaccountEdit.distributorId,
            username: xCaccountEdit.username,
            password: xCaccountEdit.password,
            duration: "default",
            expDate: xCaccountEdit.expDate,
            activationTime: xCaccountEdit.activationTime,
            usage: xCaccountEdit.usage,
            isExist: xCaccountEdit.isExist,
            remark: xCaccountEdit.remark,
            created: xCaccountEdit.created,
            platformType: xCaccountEdit.platformType,
            comboId: xCaccountEdit.comboId,
            xcType: xCaccountEdit.xcType,
            macAccountTable: xCaccountEdit.macAccountTable,
            appId:xCaccountEdit.appId
        },
    });

    var allXCombo = useproxy_allXCombo();
    // 提交表单
    const onSubmit = async (data: MacAccount) => {
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcXCAccountEdit(data, authProxy.token);
            if (response.status) {
                message.success("编辑成功");
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
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    React.useEffect(() => {
        formContext.reset()
        const fetchData = async () => {
            var res = await grpcAppName();
            setDataSource(res.appInfoList)
        };
        fetchData(); // 调用异步函数
    }, []);
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
                <LocationBar location={"编辑XCMacAccount"}/>
                <TextFieldElement name="mac" label="mac"/>
                <TextFieldElement name="username" label="用户姓名"/>
                <TextFieldElement name="password" label="用户密码"/>
                <SelectElement
                    label="过期时间"
                    name="duration"
                    defaultValue={xCaccountEdit.duration}
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
