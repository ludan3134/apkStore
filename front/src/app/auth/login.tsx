import {FormContainer, PasswordElement, TextFieldElement,} from "react-hook-form-mui";
import React from "react";
import {Alert, AlertTitle, DialogActions} from "@mui/material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import Box from "@mui/system/Box";
import {grpcLogin} from "./api/grpcLogin";
import Typography from "@mui/material/Typography";
import {grpcUserMenuInfo} from "./api/grpcUserMenuInfo";
import {authProxy} from "./store/store";
import {useTranslation} from "react-i18next";
import i18n from "../../i18n/i18n";

export function Login() {
    const [open, setOpen] = React.useState(false);
    const [err, setErr] = React.useState("");
    const {t} = useTranslation();

    const handleClose = () => {
        setOpen(false);
    };
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    const handleSubFormSubmit = async (data) => {
        console.log(data);
        var res = await grpcLogin(data.name, data.password);
        if (res.status) {
            if (res.roleId === 1) {
                localStorage.setItem("selectedLanguage", "zh"); // 存储新的语言设置
                i18n.changeLanguage("zh")
            } else {
                i18n.changeLanguage("pt")
                localStorage.setItem("selectedLanguage", "pt"); // 存储新的语言设置
            }
            var userMenu = await grpcUserMenuInfo(res.token);
            authProxy.permissions = userMenu.menuList;
            const menus = userMenu.menuList.filter((item) => item.type === 1);
            const buttons = userMenu.menuList.filter((item) => item.type === 2);
            authProxy.menu = menus;
            authProxy.buttons = buttons;
            authProxy.status = true;
            if (!userMenu.status) {
                authProxy.status = false;
            }
            console.log(userMenu);
            authProxy.userName = res.userName;
            authProxy.token = res.token;
            goto("/index");
        } else {
            setErr(res.message);
        }
    };
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            <FormContainer
                defaultValues={{name: ""}}
                onSuccess={(data) => {
                    handleSubFormSubmit(data);
                }}
            >
                <Typography variant="h3" gutterBottom>
                    {t("A3用户管理系统")}
                </Typography>
                <TextFieldElement
                    required
                    autoComplete={"new-password"}
                    margin={"dense"}
                    label={"Name"}
                    name={"name"}
                    fullWidth={true}
                />
                <br/>
                <PasswordElement
                    margin={"dense"}
                    label={"Password"}
                    required
                    name={"password"}
                    fullWidth={true}
                />
                <br/>
                {err && (
                    <Alert severity="error">
                        <AlertTitle>{err}</AlertTitle>
                    </Alert>
                )}
                <DialogActions>
                    <Button
                        variant="contained"
                        size="large"
                        type={"submit"}
                        fullWidth={true}
                    >
                        {t("submit")}
                    </Button>
                </DialogActions>
            </FormContainer>
        </Box>
    );
}
