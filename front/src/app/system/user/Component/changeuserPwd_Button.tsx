import * as React from "react";
import {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DialogActions from "@mui/material/DialogActions";
import {authProxy} from "../../../auth/store/store";
import {usePermissions} from "../../permission/store/store";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useForm} from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import KeyIcon from "@mui/icons-material/Key";
import {ChangePwd} from "../store/model";
import {grpcChangePwd} from "../api/grpcChangePwd";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function ChangeuserPwd_Button() {
    var menus = usePermissions();
    const [open, setOpen] = React.useState(false);
    const {t} = useTranslation();

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const formContext = useForm<ChangePwd>({
        // 初始化表单数据
        defaultValues: {
            oldPwd: "",
            newPwd: "",
        },
    });
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            var res = await grpcChangePwd(data.oldPwd, data.newPwd, authProxy.token);
            if (res.status) {
                setLoading(false); // 异步操作完成后，将loading状态设置为false
                alert("更新成功!请重新登录");
                goto("/login");
                return true; // 添加返回 true 停止循环
            } else {
                setLoading(false); // 异步操作完成后，将loading状态设置为false
                handleResetForm();
            }
        } catch (error) {
            setLoading(false); // 异步操作完成后，将loading状态设置为false
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
                <KeyIcon fontSize="inherit" color={"primary"}/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"xs"}
            >
                <DialogTitle>
                    {t("updateUserPassword")}
                    {/*<Button onClick={handleResetForm}>重置</Button>*/}
                </DialogTitle>

                <DialogContent dividers={true}>
                    {loading ? (
                        <Box sx={{display: "flex"}}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <FormContainer
                            formContext={formContext}
                            // 表单提交成功时的回调函数
                            onSuccess={(data) => {
                                onSubmit(data);
                            }}
                        >
                            <Stack spacing={2}>
                                <TextFieldElement name="oldPwd" label={t("oldPassword")}/>
                                <TextFieldElement name="newPwd" label={t("newPassword")}/>
                            </Stack>

                            <DialogActions>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    size="large"
                                    color={"success"}
                                >
                                    {t("submit")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleResetForm}
                                    size="large"
                                    color={"error"}
                                >
                                    {t("reset")}
                                </Button>
                            </DialogActions>
                        </FormContainer>
                    )}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
