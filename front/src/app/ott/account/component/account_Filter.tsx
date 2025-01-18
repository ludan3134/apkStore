import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {AccountStoreProxy, initialAccountfilterParams} from "../store/store";
import {AccountFilter} from "../../../../api/asm/v1/asm_pb";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import {IsStringOption} from "../../../../const/option";
import {
    Distributor2lotProxy,
    useDistributorlist,
    usefilterlot,
} from "../../../../const/distributor2lot/distributor2lot";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {grpcAccountExport} from "../api/grpcAccountExport";
import {authProxy} from "../../../auth/store/store";
import envUrls from "../../../../const/baseurl";

const Account_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AccountFilter>({
        defaultValues: initialAccountfilterParams,
    });
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();


    const handleSubFormSubmit = (data: AccountFilter) => {
        // if (Distributorvalue == null) {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "ERROR"
        //     IsOpenDialog.content = "请选中分销商和型号"
        //     return
        // }
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";

        if (!Modelvalue) {
            data.modelId = "";
        }
        // if (validateMacAddress(data.macString)) {
        //     data.macString = addColonsToMacAddress(data.macString)
        //     AccountStoreProxy.AccountFilter = data
        // } else if (data.macString == "") {
        //     console.log("data", data)
        //     AccountStoreProxy.AccountFilter = data
        // } else {
        //     message.error("mac地址输入格式不正确,请重新输入")
        //
        //     handleResetForm();
        //     return
        // }
        AccountStoreProxy.AccountFilter = data;

        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;

        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        AccountStoreProxy.AccountFilter = {} as AccountFilter;
    };
    const handleExportFile = async () => {
        try {
            const data = formContext.getValues();
            data.distributorId = Distributorvalue || "";
            data.modelId = Modelvalue || "";

            const res = await grpcAccountExport(data, authProxy.token);
            window.open(envUrls.ExportFile + res.path)
        } catch (error) {
            console.error("导出文件失败:", error);
            // 这里可以处理错误，例如显示错误消息
        }
    };
    // 关于distributor to lots
    useEffect(() => {
        formContext.resetField("lotId", {defaultValue: ""});
        Distributor2lotProxy.filterLots = Distributor2lotProxy.lots.filter(
            (lot) => lot.distributorId === Distributorvalue,
        );
    }, [Distributorvalue]);
    const distributors = useDistributorlist();
    var lotLabels = usefilterlot();

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}
        >
            <Stack
                spacing={2}
            >
                <Stack spacing={2} direction={"row"}>
                    <TextFieldElement name="macString" label="mac地址" sx={{minWidth: "500px",}}/>
                    <TextFieldElement name="chipIdentity" label="chipIdentity" sx={{minWidth: "500px",}}/>

                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                    <SelectElement
                        name="lotId"
                        label={"批次号"}
                        options={lotLabels}
                        sx={{
                            minWidth: "600px",
                        }}
                    />
                </Stack>
                <Stack spacing={2} direction={"row"}>
                    <SelectElement
                        label="是否激活"
                        name="isActive"
                        options={IsStringOption}
                        sx={{
                            minWidth: "600px",
                        }}
                    />
                    <SelectElement
                        label="是否服务"
                        name="isService"
                        options={IsStringOption}
                        sx={{
                            minWidth: "600px",
                        }}
                    />
                    <SelectElement
                        label="是否过期"
                        name="isExpired"
                        options={IsStringOption}
                        sx={{
                            minWidth: "600px",
                        }}
                    />
                    <Button type="submit">筛选</Button>
                    <Button type="button" onClick={handleResetForm}>
                        重置
                    </Button>
                    <Button type="button" onClick={() => handleExportFile()}>
                        导出
                    </Button>
                </Stack>

            </Stack>
        </FormContainer>
    );
};

export default Account_Filter;
