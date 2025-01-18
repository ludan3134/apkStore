import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import {initialTVFirewaredetailParams} from "../../store/firewareversion/store";
import {grpcFirewareversionInsert} from "../../api/firewareversion/grpcFirewareversionInsert";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {FirmwareDetail} from "../../../../../api/fs/v1/fm_pb";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption, UpdateFirewareversionOption,} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import DialogActions from "@mui/material/DialogActions";

export const TVFirewareversion_Add = () => {
    // 获取查看TVFirewareversion版本权限
    var permissions = authProxy.permissions;
    const TVFirewareversionversionTable = permissions.find(
        (option) => option.name === "查看电视固件版本",
    );
    // 获取到TVFirewareversionId 和 modelName 参数
    const {id, modelName} = useParams();
    console.log("id", id);
    console.log("modelName", modelName);
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [fireversionfile, setFireversionfile] = useState<UploadResponse>();
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 返回上一级
    const handleReturn = () => {
        goto(
            `${TVFirewareversionversionTable?.url}/${TVFirewareversionversionTable?.id}/${id}`,
        );
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<FirmwareDetail>({
        // 初始化表单数据
        defaultValues: initialTVFirewaredetailParams,
    });

    // 表单提交时的回调函数
    const onSubmit = async (TVFirewareversionversion: FirmwareDetail) => {
        setLoading(true);
        TVFirewareversionversion.firmwareId = id;
        if (!fireversionfile) {
            message.error("请上传电视固件版本");

            setLoading(false);
            return;
        }

        try {
            TVFirewareversionversion.md5 = fireversionfile.md5;
            TVFirewareversionversion.url = fireversionfile.media_uri;
            TVFirewareversionversion.filesize = fireversionfile.file_size;
            var res = await grpcFirewareversionInsert(
                TVFirewareversionversion,
                authProxy.token,
            );
            if (res.status) {
                console.log("TVFirewareversionTable", TVFirewareversionversionTable);
                goto(
                    `${TVFirewareversionversionTable?.url}/${TVFirewareversionversionTable?.id}/${id}`,
                );
                return true; // 添加返回 true 停止循环
            } else {
                handleResetForm();
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        formContext.reset(); // 重置表单值
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
                <LocationBar location={"新增TVFirewareversion版本"}/>
                <TextFieldElement name="version" label="版本"/>
                <TextFieldElement name="content" label="内容"/>
                <TextFieldElement name="savePosition" label="保存地址"/>
                <TextFieldElement name="buildId" label="buildId"/>
                <TextFieldElement name="currentVersion" label="当前版本"/>
                <SelectElement
                    size={"medium"}
                    label="是否增量包"
                    name="packageType"
                    options={UpdateFirewareversionOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="强制更新"
                    name="forceUpdate"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <Uploadfile
                    title={"电视固件版本"}
                    dir={"/firewareversion/" + Date.now().toString() + "/"}
                    setRes={setFireversionfile}
                    file_type={"tv"}
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
