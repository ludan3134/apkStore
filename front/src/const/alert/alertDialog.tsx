import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {IsOpenDialog, useproxy_IsOpenDialog, useproxy_IsOpenDialogContent, useproxy_IsOpenDialogTitle,} from "./store";
import {useNavigate} from "react-router-dom";

export default function AlertDialog() {
    var IsOpen = useproxy_IsOpenDialog();
    var title = useproxy_IsOpenDialogTitle();
    var content = useproxy_IsOpenDialogContent();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const handleClose = () => {
        console.log("title", title);
        console.log(typeof title);
        console.log("content", content);

        if (
            title.includes("16") ||
            title.includes("401") ||
            title.includes("4001")
        ) {
            navigate("/login"); // 跳转到登录页面的URL
        }
        IsOpenDialog.IsOpen = false;
        IsOpenDialog.content = "";
        IsOpenDialog.title = "";
    };

    return (
        <React.Fragment>
            <Dialog
                open={IsOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
