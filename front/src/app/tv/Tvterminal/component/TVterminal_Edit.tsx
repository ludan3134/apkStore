import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useproxy_TVTerminalEdit, useproxy_TVTerminaltableUrl,} from "../store/store";
import {message} from "antd";
import {TerminalInfo} from "../../../../api/asm/v1/asm_pb";
import {grpTerminalEdit} from "../api/grpTerminalEdit";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";
import {IsConfirmDialog} from "../../../../const/alert/store";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";

export const TVterminal_Edit = () => {
    // 获取编辑变量
    var terminal = useproxy_TVTerminalEdit();
    // 获取terminaltable地址信息
    var termianltableUrl = useproxy_TVTerminaltableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<TerminalInfo>({
        // 初始化表单数据
        defaultValues: {
            id: terminal.id,
            distributorId: terminal.distributorId,
            lotId: terminal.lotId,
            boxId: terminal.boxId,
            isUsed: terminal.isUsed,
            macString: terminal.macString,
            chipIdentity: terminal.chipIdentity,
            serial: terminal.serial,
            activeCode: terminal.activeCode,
            updatedAt: terminal.updatedAt,
            distributorName: terminal.distributorName,
            setActive: terminal.setActive,
            setService: terminal.setService,
            modelName: terminal.modelName,
            modelId: terminal.modelId,
            storeAuth: terminal.storeAuth,
        },
    });

    // 提交表单
    const onSubmit = async (data: TerminalInfo) => {
        console.log("data", data);
        if (modelValue == "0" || !distributorValue || !modelValue) {
            message.error("分销商型号不能为空/0)");
            return;
        }
        data.distributorId = distributorValue;
        data.modelId = modelValue;
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpTerminalEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");

                goto(termianltableUrl);
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
        DistributorInputStoreProxy.DistributorValue = terminal.distributorId;
        DistributorInputStoreProxy.ModelValue = terminal.modelId;
        IsConfirmDialog.refleshPage = true;
        setDistributorvalue(null);
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(termianltableUrl);
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
                <LocationBar location={"编辑电视终端"}/>
                <TextFieldElement name="macString" label="mac地址" required/>
                <TextFieldElement name="chipIdentity" label="芯片id" required/>
                <TextFieldElement name="serial" label="SN码" required/>
                <Distributor2Model/>

                <SelectElement
                    size={"medium"}
                    label="设置激活状态"
                    name="setActive"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="设置服务状态"
                    name="setService"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="设置市场授权状态"
                    name="storeAuth"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
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
