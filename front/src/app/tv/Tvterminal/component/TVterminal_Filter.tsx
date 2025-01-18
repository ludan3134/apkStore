import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {initialTVTerminalfilterParams, TVTerminalStoreProxy,} from "../store/store";
import {TerminalFilter} from "../../../../api/asm/v1/asm_pb";
import {
    Distributor2lotProxy,
    useDistributorlist,
    usefilterlot,
} from "../../../../const/distributor2lot/distributor2lot";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import {IsStringOption} from "../../../../const/option";
import {authProxy} from "../../../auth/store/store";
import envUrls from "../../../../const/baseurl";
import {grpcTerminalExport} from "../api/grpcTerminalExport";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
// 2879940cfe44

const TVterminal_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<TerminalFilter>({
        defaultValues: initialTVTerminalfilterParams,
    });
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();

    const handleSubFormSubmit = (data: TerminalFilter) => {
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        if (!Modelvalue) {
            data.modelId = "";
        }
        // console.log("data.macstring", data.macString)
        // // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // // apkProxy.filterModel = data;
        // if (validateMacAddress(data.macString)) {
        //     data.macString = addColonsToMacAddress(data.macString)
        //     TVTerminalStoreProxy.TVTerminalFilter = data
        // } else if (data.macString == "") {
        //     console.log("data", data)
        //     TVTerminalStoreProxy.TVTerminalFilter = data
        // } else {
        //     message.error("mac地址输入格式不正确")
        //
        //     handleResetForm();
        //     return
        // }
        TVTerminalStoreProxy.TVTerminalFilter = data;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        TVTerminalStoreProxy.TVTerminalFilter = {} as TerminalFilter;
    };
    const handleExportFile = async () => {
        try {
            const data = formContext.getValues();
            data.distributorId = Distributorvalue || "";
            data.modelId = Modelvalue || "";

            const res = await grpcTerminalExport(data, authProxy.token);
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
                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <TextFieldElement name="macString" label="mac地址" sx={{minWidth: "600px"}}/>
                    <TextFieldElement name="chipIdentity" label="芯片Id" sx={{minWidth: "600px"}}/>

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
                            minWidth: "300px",
                        }}
                    />
                </Stack>
                <Stack
                    direction={"row"}
                    spacing={2}
                    divider={<Divider orientation="vertical" flexItem/>}
                >

                    <SelectElement
                        label="是否使用"
                        name="isUsed"
                        options={IsStringOption}
                        sx={{
                            minWidth: "300px",
                        }}
                    />
                    <SelectElement
                        label="设置激活状态"
                        name="setActive"
                        options={IsStringOption}
                        sx={{
                            minWidth: "300px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="设置服务状态"
                        name="setService"
                        options={IsStringOption}
                        sx={{
                            minWidth: "500px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="设置市场授权状态"
                        name="storeAuth"
                        options={IsStringOption}
                        sx={{
                            minWidth: "500px",
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

export default TVterminal_Filter;
