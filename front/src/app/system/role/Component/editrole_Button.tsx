import * as React from "react";
import {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DialogActions from "@mui/material/DialogActions";
import {authProxy} from "../../../auth/store/store";
import {usePermissions} from "../../permission/store/store";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {Role} from "../../../../api/ax/v1/axm_pb";
import {IsConfirmDialog} from "../../../../const/alert/store";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import {grpcRoleEdit} from "../api/grpcRoleEdit";
import {message} from "antd";

export default function Editrole_Button({row}) {
    var menus = usePermissions();
    const [open, setOpen] = React.useState(false);
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const formContext = useForm<Role>({
        // 初始化表单数据
        defaultValues: {
            roleName: row.roleName,
            id: row.id,
        },
    });
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            var res = await grpcRoleEdit(data, authProxy.token);
            if (res.status) {
                setLoading(false); // 异步操作完成后，将loading状态设置为false
                handleClose();
                message.success("更新成功");
                IsConfirmDialog.refleshPage = true;
                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            setLoading(false); // 异步操作完成后，将loading状态设置为false
            message.error("调用接口发生错误");
            handleResetForm();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    // 开启对话框
    const handleClickOpen = async () => {
        setOpen(true);
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
    };
    return (
        <React.Fragment>
            <IconButton aria-label="delete" size="medium" onClick={handleClickOpen}>
                <EditIcon fontSize="inherit" color={"primary"}/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"xs"}
            >
                <DialogTitle>
                    更新角色
                    {/*<Button onClick={handleResetForm}>重置</Button>*/}
                </DialogTitle>

                <DialogContent dividers={true}>
                    {loading ? (
                        <Box sx={{display: "flex"}}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <Box sx={{minHeight: 110, flexGrow: 1, maxWidth: 300}}>
                            <FormContainer
                                formContext={formContext}
                                // 表单提交成功时的回调函数
                                onSuccess={(data) => {
                                    onSubmit(data);
                                }}
                            >
                                <TextFieldElement name="roleName" label="用户名"/>
                                <DialogActions>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="large"
                                        color={"success"}
                                    >
                                        提交
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleResetForm}
                                        size="large"
                                        color={"error"}
                                    >
                                        重置
                                    </Button>
                                </DialogActions>
                            </FormContainer>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
