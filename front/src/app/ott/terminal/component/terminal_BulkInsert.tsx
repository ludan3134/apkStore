import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, IconButton, ImageListItem, ImageListItemBar, Stack,} from "@mui/material";
import {FormContainer, SelectElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTerminalBulkImportParams, useproxy_TerminaltableUrl,} from "../store/store";
import {TerminalBulkImport} from "../store/model";

import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import {
    Distributor2lotProxy,
    useDistributorlist,
    usefilterlot,
} from "../../../../const/distributor2lot/distributor2lot";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {IsBoolOption} from "../../../../const/option";
import Uploadfile2parent from "../../../../const/uploadfile/uploadfile2parent";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import envUrls from "../../../../const/baseurl";

function InfoIcon() {
    return null;
}

export const Terminal_BulkInsert = () => {
    // 获取accounttable地址信息
    var termianltableUrl = useproxy_TerminaltableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    // 文件传递
    const [terminalFile, setTerminalFile] = useState<File>();
    // 请求是否成功
    const handleterminalFileUpload = (file: File) => {
        setTerminalFile(file);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<TerminalBulkImport>({
        // 初始化表单数据
        defaultValues: initialTerminalBulkImportParams,
    });

    // 提交表单
    const onSubmit = async (data: TerminalBulkImport, file: File) => {
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商型号");
            setLoading(false);
            return;
        }
        data.distributor_id = Distributorvalue;
        data.model_id = Modelvalue;
        if (!terminalFile) {
            message.error("请上传批量导入文件");
            return;
        }
        setLoading(true);
        // 如果其中一个文件存在，则执行新增操作
        try {
            const formData = new FormData();
            formData.append("excel", file);
            formData.append("distributor_id", data.distributor_id);
            formData.append("lot_id", data.lot_id);
            formData.append("set_active", String(data.set_active));
            formData.append("set_service", String(data.set_service));
            formData.append("store_auth", String(data.storeAuth));
            formData.append("model_id", String(data.model_id));
            formData.append("token", authProxy.token);

            formData.append("function", "importTerminal");
            const response = await fetch(envUrls.BulkImportBaseUrl, {
                method: "POST",
                body: formData,
                mode: "cors",
            });
            console.log("response", response);
            if (response.ok) {
                // message.success("添加成功")
                var res = await response.json();
                console.log("res", res);
                message.success(res.message);
                goto(termianltableUrl);
            }
            // 执行数据新增操作
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
        goto(termianltableUrl);
    };
    // 关于distributor to lots
    useEffect(() => {
        formContext.resetField("lot_id", {defaultValue: ""});
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
                onSubmit(data, terminalFile);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}

            <Stack spacing={2}>
                <LocationBar location={"批量导入终端"}/>
                <Stack direction={"row"} spacing={2}>
                    {/*<SelectElement*/}
                    {/*    label="分销商"*/}
                    {/*    name="distributor_id"*/}
                    {/*    options={distributors}*/}
                    {/*    sx={{*/}
                    {/*        minWidth: '150px'*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                    <SelectElement
                        name="lot_id"
                        label={"批次号"}
                        options={lotLabels}
                        required={true}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        label="设置激活状态"
                        name="set_active"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="设置服务状态"
                        name="set_service"
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
            </Stack>
            <Stack style={{width: "558px", height: "296px"}}>
                <ImageListItem>
                    <img
                        // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        src={`http://upd.rja3.xyz/images/Apps/20241217163553.png`}
                        alt={"图片找不到"} // 使用数据行中的 altText 属性作为 alt 文本
                        // loading="lazy"
                    />
                    <ImageListItemBar
                        title={"上传格式要求示例"}
                        subtitle={"文件名不能含有中文"}
                        actionIcon={
                            <IconButton
                                sx={{color: "rgba(255, 255, 255, 0.54)"}}
                                aria-label={`上传格式要求`}
                            >
                                <InfoIcon/>
                            </IconButton>
                        }
                    />
                </ImageListItem>
                <Uploadfile2parent
                    onFileUpload={handleterminalFileUpload}
                    fileName={"批量导入终端"}
                />
            </Stack>
            <DialogActions>
                {/*<IconButton aria-label="delete" size="large" onClick={() => handleReturn()}>*/}
                {/*    <KeyboardReturnIcon color={"primary"}/>*/}
                {/*</IconButton>*/}
                <Button variant="contained" size="small" onClick={() => handleReturn()}>
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
