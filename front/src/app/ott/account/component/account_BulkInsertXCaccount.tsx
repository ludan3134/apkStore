import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {TerminalBulkImport} from "../../terminal/store/model";
import {initialTerminalBulkImportParams, useproxy_TerminaltableUrl,} from "../../terminal/store/store";
import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Uploadfile2parent from "../../../../const/uploadfile/uploadfile2parent";
import envUrls from "../../../../const/baseurl";

export const Account_BulkInsertXCaccount = () => {
    // 获取accounttable地址信息
    var termianltableUrl = useproxy_TerminaltableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    const [Distributorvalue, setDistributorvalue] = useState<String>();

    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
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
        if (!Distributorvalue) {
            message.error("请选中分销商");
            setLoading(false);
            return;
        }
        data.distributor_id = Distributorvalue;
        console.log("data", data);
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
            formData.append("token", authProxy.token);
            formData.append("function", "updateDistributor");
            const response = await fetch(envUrls.BulkImportBaseUrl, {
                method: "POST",
                body: formData,
                mode: "cors",
            });
            console.log("response", response);
            if (response.ok) {
                message.error("新增成功");
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
                onSubmit(data, terminalFile);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}

            <Stack spacing={2}>
                <LocationBar location={"批量导入终端"}/>
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Uploadfile2parent
                        onFileUpload={handleterminalFileUpload}
                        fileName={"批量创建XC账号"}
                    />
                </Stack>
            </Stack>
            <DialogActions>
                {/*<IconButton aria-label="delete" size="large" onClick={() => handleReturn()}>*/}
                {/*    <KeyboardReturnIcon color={"primary"}/>*/}
                {/*</IconButton>*/}
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
