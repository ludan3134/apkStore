import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {useproxy_ServerGroupEdit, useproxy_ServerGroupServerList, useproxy_ServerGrouptableUrl,} from "../store/store";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import {ServerGroup} from "../../../../api/tv_asm/v1/asm_pb";
import {grpcServerGroupEdit} from "../api/grpcdomaingroupEdit";

export const TVDomaingroup_Edit = () => {
    var groupServerList = useproxy_ServerGroupServerList();

    // 获取编辑变量
    var ServerGroup = useproxy_ServerGroupEdit();
    // 获取ServerGrouptable地址信息
    var ServerGrouptableUrl = useproxy_ServerGrouptableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ServerGroup>({
        // 初始化表单数据
        defaultValues: {
            id: ServerGroup.id,
            name: ServerGroup.name,
            startMac: ServerGroup.startMac,
            endMac: ServerGroup.endMac,
            count: ServerGroup.count,
            updatedAt: ServerGroup.updatedAt,
            isUse: ServerGroup.isUse,
            serverIds: ServerGroup.serverIds,
            serverList: ServerGroup.serverList,
        },
    });
    // 关于distributor to models
    //
    // const selectedDistributor = formContext.watch('distributorId');
    // useEffect(() => {
    //     Distributor2modelProxy.filterModels = Distributor2modelProxy.models.filter((model) => model.distributorId === selectedDistributor);
    // }, [selectedDistributor]);
    //
    // const distributors = useDistributors();
    // const models = usefiltermodel();
    // 关于distributor to models

    // 提交表单
    const onSubmit = async (data: ServerGroup) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作

        try {
            // 执行数据更新操作
            var response = await grpcServerGroupEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");

                goto(ServerGrouptableUrl);
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
        goto(ServerGrouptableUrl);
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
                <LocationBar location={"编辑电视域名分组"}/>
                <TextFieldElement name="name" label="电视域名名称" required/>
                <TextFieldElement name="startMac" label="起始mac" required/>
                <TextFieldElement name="count" label="数量" type={"number"} required/>
                {/*<TextFieldElement name="serverList" label="服务列表" required/>*/}
                <MultiSelectElement
                    itemKey="id"
                    itemLabel="name"
                    label="服务列表"
                    name="serverIds"
                    options={groupServerList}
                    showChips={true}
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
