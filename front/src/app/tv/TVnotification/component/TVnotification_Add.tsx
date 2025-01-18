import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {initialNotificationParams, useproxy_NotificationEdit, useproxy_NotificationtableUrl,} from "../store/store";
import {grpcTvNotificationInsert} from "../api/grpcTvNotificationInsert";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {Notification} from "../../../../api/tv_fs/v1/fm_pb";

export const TVnotification_Add = () => {
    // 获取编辑变量
    var notification = useproxy_NotificationEdit();
    // 获取notificationtable地址信息
    var notificationtableUrl = useproxy_NotificationtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Notification>({
        // 初始化表单数据
        defaultValues: initialNotificationParams,
    });
    // 关于distributor to models

    // const selectedDistributor = formContext.watch('distributorId');
    // useEffect(() => {
    //     Distributor2modelProxy.filterModels = Distributor2modelProxy.models.filter((model) => model.distributorId === selectedDistributor);
    // }, [selectedDistributor]);
    //
    // const distributors = useDistributors();
    // const models = usefiltermodel();
    // 关于distributor to models

    // 提交表单
    const onSubmit = async (data: Notification) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商型号");
            setLoading(false);
            return;
        }
        data.distributorId = Distributorvalue;
        data.modelId = Modelvalue;
        try {
            // 执行数据更新操作
            var response = await grpcTvNotificationInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(notificationtableUrl);
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
        goto(notificationtableUrl);
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
                <LocationBar location={"编辑notification"}/>
                <TextFieldElement name="name" label="消息名称" required/>
                <TextFieldElement name="content" label="消息内容" required/>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />

                <SelectElement
                    size={"medium"}
                    label="是否使用"
                    name="isUse"
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
