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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import {Role} from "../../../../api/ax/v1/axm_pb";
import {initialRoleParams} from "../store/store";
import {grpcRoleAdd} from "../api/grpcRoleAdd";
import CircularProgress from "@mui/material/CircularProgress";
import {message} from "antd";
import {IsDistributorOption} from "../../../../const/option";
import {IsConfirmDialog} from "../../../../const/alert/store";

export default function Addrole_Button() {
    var menus = usePermissions();
    const [open, setOpen] = React.useState(false);
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const formContext = useForm<Role>({
        // 初始化表单数据
        defaultValues: initialRoleParams,
    });
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            var res = await grpcRoleAdd(data, authProxy.token);
            if (res.status) {
                setLoading(false); // 异步操作完成后，将loading状态设置为false
                handleClose();
                message.success("添加成功");
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
                <PersonAddAlt1Icon fontSize="inherit" color={"primary"}/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"xs"}
            >
                <DialogTitle>
                    新增角色
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
                                <SelectElement
                                    size={"medium"}
                                    label="是否为分销商"
                                    name="isDistributor"
                                    options={IsDistributorOption}
                                    sx={{
                                        minWidth: "275px",
                                    }}
                                />
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
