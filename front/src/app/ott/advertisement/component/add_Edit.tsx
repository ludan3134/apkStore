import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextareaAutosizeElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import {grpcAddEdit} from "../api/grpcAddEdit";

import DialogActions from "@mui/material/DialogActions";

import {useproxy_AddEdit, useproxy_AddtableUrl} from "../store/store";
import {message} from "antd";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {Advertisement} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import Uploadfile from "../../../../const/uploadfile/uploadfile";

export const Add_Edit = () => {
    // 获取编辑变量
    var Add = useproxy_AddEdit();
    // 获取addtable地址信息
    var addtableUrl = useproxy_AddtableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        Add.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    // 上传Addfile
    const [addfileRes, setAddfileRes] = useState<UploadResponse>();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Advertisement>({
        // 初始化表单数据
        defaultValues: {
            id: Add.id,
            name: Add.name,
            playTime: Add.playTime,
            version: Add.version,
            md5: Add.md5,
            url: Add.url,
            content: Add.content,
            filesize: Add.filesize,
            distributorId: Add.distributorId,
            modelId: Add.modelId,
            created: Add.created,
            updated: Add.updated,
            deleted: Add.deleted,
            type: Add.type,
            modelName: Add.modelName,
            distributorName: Add.distributorName,
        },
    });

    // 提交表单
    const onSubmit = async (add: Advertisement) => {
        setLoading(true);
        add.distributorId = Distributorvalue || Add.distributorId;
        add.modelId = Modelvalue || Add.modelId;
        // 如果其中一个文件存在，则执行更新操作
        if (addfileRes) {
            add.url = addfileRes.media_uri;
            add.md5 = addfileRes.md5;
            add.filesize = addfileRes.file_size;
        }
        try {
            // 执行数据更新操作
            var response = await grpcAddEdit(add, authProxy.token);
            if (response.status) {
                message.success("更新成功!");

                goto(addtableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");
            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        setDistributorvalue(null);
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(addtableUrl);
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
                <LocationBar location={"编辑add"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="playTime" label="播放时间" required/>
                <TextFieldElement name="version" label="版本" required/>
                <TextareaAutosizeElement name="content" label="内容"/>
                <TextFieldElement name="type" label="类型"/>
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                    {/*<SelectElement*/}
                    {/*    size={"medium"}*/}
                    {/*    label="类型"*/}
                    {/*    name="type"*/}
                    {/*    options={AddOption}*/}
                    {/*    sx={{*/}
                    {/*        minWidth: '275px'*/}
                    {/*    }}*/}
                    {/*    required={true}*/}
                    {/*/>*/}
                </Stack>
                <Stack
                    direction={"row"}
                    spacing={5}
                    alignItems={"center"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"Add"}
                        dir={"/add/" + Date.now().toString() + "/"}
                        setRes={setAddfileRes}
                        file_type={null}
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
