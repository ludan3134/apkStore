import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {userIsforbinOption, useUserlisteditUser, useUserlistrolist, useUsertableUrl,} from "../store/store";
import {User} from "../../../../api/ax/v1/axm_pb";
import {grpcUserEdit} from "../api/grpcUserEdit";
import {authProxy} from "../../../auth/store/store";
import {useNavigate} from "react-router-dom";
import {IsConfirmDialog} from "../../../../const/alert/store";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";

export const User_Edit = () => {
    var user = useUserlisteditUser();
    var usertableUrl = useUsertableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    // 使用 useForm 声明一个 formContext
    console.log("user", user);
    const formContext = useForm<User>({
        // 初始化表单数据
        defaultValues: {
            id: user.id,
            userName: user.userName,
            password: user.password,
            isUse: user.isUse,
            deleted: user.deleted,
            created: user.created,
            roleId: user.roleId,
            distributorId: "0",
        },
    });
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const onSubmit = async (data) => {
        console.log("data", data);
        setLoading(true);
        // if (Distributorvalue == null) {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "ERROR"
        //     IsOpenDialog.content = "请选中分销商"
        //     setLoading(false);
        //     return
        // }
        data.distributorId = Distributorvalue;
        try {
            // const role = roles.find((role) => role.id === data.roleId);
            //
            // if ((role?.label.includes("代理商") && data.distributorId === "0") || (!role?.label.includes("代理商") && data.distributorId !== "0")) {
            //     setLoading(false);
            //     IsOpenDialog.IsOpen = true;
            //     IsOpenDialog.title = "ERROR";
            //
            //     if (data.roleId === 2) {
            //         IsOpenDialog.content = "请选择分销商!";
            //     } else {
            //         IsOpenDialog.content = "非代理商角色不能选择分销商，请重新选择!";
            //     }
            //
            //     handleResetForm();
            //     return;
            // }

            var res = await grpcUserEdit(data, authProxy.token);
            if (res.status) {
                setLoading(false); // 异步操作完成后，将loading状态设置为false
                message.success("更新成功");
                IsConfirmDialog.refleshPage = true;
                goto(usertableUrl);
                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            setLoading(false); // 异步操作完成后，将loading状态设置为false
            message.error("调用接口发生错误");
            handleResetForm();
        }
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
    };
    var roles = useUserlistrolist();
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

            <Stack spacing={2}>
                <TextFieldElement name="userName" label="用户名"/>
                <SelectElement
                    size={"medium"}
                    label="是否启用"
                    name="isUse"
                    options={userIsforbinOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="角色"
                    name="roleId"
                    required
                    options={roles}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                {/*<Distributorinput setDistributorvalue={setDistributorvalue} Distributorvalue={Distributorvalue}/>*/}
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
