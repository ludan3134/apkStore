import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {
    componentTypesOptions,
    initialPermissionParams,
    PermissionStoreProxy,
    useproxy_PermssiontableUrl,
} from "../../store/store";
import {PermissionStore} from "../../store/model";
import {grpcPermissionAdd} from "../../api/grpcPermissionAdd";
import {authProxy} from "../../../../auth/store/store";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Parentid_Add from "./parentid_Add";
import {message} from "antd";

export const Permission_Add = () => {
    var PermissionTree_URL = useproxy_PermssiontableUrl(); // 跳转路由

    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 重置
    const [IsReset, setIsReset] = useState(false);

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<PermissionStore>({
        // 初始化表单数据
        defaultValues: initialPermissionParams,
    });
    const [selectedValue, setSelectedValue] = React.useState("");
    const [TreeValue, setTreeValue] = useState();
    console.log("TreeValue", TreeValue);
    // 表单提交时的回调函数`
    const onSubmit = async (data) => {
        console.log("data", selectedValue);
        setLoading(true);
        data.parentId = parseInt(selectedValue);
        if (selectedValue == "") {
            data.parentId = 1;
        }
        try {
            var res = await grpcPermissionAdd(data, authProxy.token);
            if (res.status) {
                message.success("更新成功");

                goto(PermissionTree_URL);
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading;
    };
    const handleResetForm = () => {
        PermissionStoreProxy.isSelectNull = true;
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
                <LocationBar location={"新增权限"}/>
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
