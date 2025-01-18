import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {componentTypesOptions, usePermissionEdit, useproxy_PermssiontableUrl,} from "../store/store";
import {Menu} from "../../../../api/ax/v1/axm_pb";
import {authProxy} from "../../../auth/store/store";
import Parentid_Add from "./permission_Add/parentid_Add";
import {IsOpenDialog} from "../../../../const/alert/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {grpcPermissionEdit} from "../api/grpcPermissionEdit";

export const Permission_Edit = () => {
    var menu = usePermissionEdit();
    var PermissionTree_URL = useproxy_PermssiontableUrl(); // 跳转路由
    const navigate = useNavigate();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Menu>({
        // 初始化表单数据
        defaultValues: {
            id: menu.id,
            url: menu.url,
            parentId: menu.parentId,
            path: menu.path,
            name: menu.name,
            type: menu.type,
        },
    });
    const [selectedValue, setSelectedValue] = React.useState("");

    // 表单提交时的回调函数`
    const onSubmit = async (data) => {
        setLoading(true);
        data.parentId = parseInt(selectedValue);
        if (selectedValue == "") {
            data.parentId = 1;
        }
        try {
            var res = await grpcPermissionEdit(data, authProxy.token);
            if (res.status) {
                IsOpenDialog.IsOpen = true;
                IsOpenDialog.title = "SUCCESS";
                IsOpenDialog.content = "更新成功";
                goto(PermissionTree_URL);
            } else {
                IsOpenDialog.IsOpen = true;
                IsOpenDialog.title = "ERROR";
                IsOpenDialog.content = "更新数据失败,请重新操作";
                handleResetForm();
            }
        } catch (error) {
            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "ERROR";
            IsOpenDialog.content = "文件上传或数据插入过程发生错误";
        }
        setLoading(false);
    };
    const handleResetForm = () => {
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
            {/* 使用 TextFieldElement 渲染表单组件 */}
            {loading && <CircularIndeterminate/>}
            <Stack spacing={2}>
                <LocationBar location={"编辑权限"}/>
                <TextFieldElement name="name" label="名称"/>
                <Parentid_Add setSelectedValue={setSelectedValue}/>
                <TextFieldElement name="url" label="路由地址"/>
                <TextFieldElement name="path" label="接口地址"/>

                <SelectElement
                    size={"medium"}
                    label="权限类型"
                    name="type"
                    options={componentTypesOptions}
                    sx={{
                        minWidth: "150px",
                    }}
                />
            </Stack>
            <DialogActions>
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
