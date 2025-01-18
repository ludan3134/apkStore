import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {useproxy_AccountEdit, useproxy_AccounttableUrl} from "../store/store";
import {grpcAccountEdit} from "../api/grpcAccountEdit";
import {message} from "antd";
import {IsConfirmDialog} from "../../../../const/alert/store";
import {AccountInfo} from "../../../../api/asm/v1/asm_pb";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import Distributor2Model from "../../../../const/distributortomodel/component/distributor2model";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../const/distributortomodel/store/store";

export const Account_Edit = () => {
    // 获取编辑变量
    var account = useproxy_AccountEdit();
    // 获取accounttable地址信息
    var accounttableUrl = useproxy_AccounttableUrl();
    console.log('accounttableUrl"', accounttableUrl);
    // 请求是否成功
    const [loading, setLoading] = useState(false);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AccountInfo>({
        // 初始化表单数据
        defaultValues: {
            id: account.id,
            distributorId: account.distributorId,
            lotId: account.lotId,
            boxId: account.boxId,
            stbId: account.stbId,
            macString: account.macString,
            chipIdentity: account.chipIdentity,
            apkType: account.apkType,
            isActive: account.isActive,
            isService: account.isService,
            registerDate: account.registerDate,
            activeDateStart: account.activeDateStart,
            activeDays: account.activeDays,
            isExpired: account.isExpired,
            createAt: account.createAt,
            updatedAt: account.updatedAt,
            isDeleted: account.isDeleted,
            distributorName: account.distributorName,
            storeAuth: account.storeAuth,
            modelId: account.modelId,
            modelName: account.modelName,
        },
    });

    // 提交表单
    const onSubmit = async (data: AccountInfo) => {
        console.log("distributorValue", distributorValue);
        console.log("modelValue", distributorValue);
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
            var response = await grpcAccountEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功!");
                goto(accounttableUrl);
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
        DistributorInputStoreProxy.DistributorValue = account.distributorId;
        DistributorInputStoreProxy.ModelValue = account.modelId;
        IsConfirmDialog.refleshPage = true;

        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(accounttableUrl);
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
                <LocationBar location={"编辑account"}/>
                <TextFieldElement name="chipIdentity" label="芯片id" required/>
                <Distributor2Model></Distributor2Model>
                <Stack direction={"row"} spacing={2}>
                    <SelectElement
                        size={"medium"}
                        label="是否激活"
                        name="isActive"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="是否服务"
                        name="isService"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="是否过期"
                        name="isExpired"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="市场授权"
                        name="storeAuth"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                </Stack>
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
