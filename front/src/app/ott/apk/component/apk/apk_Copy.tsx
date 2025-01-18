import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {grpcApkCopy} from "../../api/apk/grpcApkCopy";
import {Alert, message, Modal} from "antd";
import {Button, Stack} from "@mui/material";
import {authProxy} from "../../../../auth/store/store";
import {IsConfirmDialog} from "../../../../../const/alert/store";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Multymodelinput from "../../../../../const/distributortomodel/component/multymodelinput";

export default function Apk_Copy({selectedApks}) {
    var {menuId} = useParams();

    const [open, setOpen] = React.useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState();
    const [Modelvalue, setModelvalue] = useState<string[]>();
    // 分销商值

    // 开启对话框
    const handleClickOpen = async () => {
        setDistributorvalue(null);
        setModelvalue([]);
        var permissions = authProxy.permissions;
        const childrenMenu = permissions.filter(
            (option) => option.parentId === Number(menuId),
        );
        let foundOption = childrenMenu.find((option) => option.name === "复制APK");
        if (foundOption) {
            setOpen(true);
            setHasPermission(true);
        } else {
            setHasPermission(false);
        }
    };

    // 回调数据给父组件
    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        if (selectedApks.length === 0) {
            message.error("APK选择不能为空");
            setConfirmLoading(false);
            setOpen(false);
            return;
        }
        if (Distributorvalue == "" || Modelvalue.length === 0) {
            message.error("分销商/型号不能为空!");
            setConfirmLoading(false);
            return;
        }
        var res = await grpcApkCopy(
            selectedApks,
            Distributorvalue,
            Modelvalue,
            authProxy.token,
        );
        if (res.status) {
            IsConfirmDialog.refleshPage = true;
            setConfirmLoading(false);
            message.info(res.message);
        } else {
            message.error(res.message);
        }
        setOpen(false);
        setConfirmLoading(false);
    };
    return (
        <React.Fragment>
            {/*<IconButton aria-label="delete" size="large" onClick={handleClickOpen}>*/}
            {/*    <ContentCopyIcon fontSize="inherit" color={"primary"}/>*/}
            {/*</IconButton>*/}
            <Button
                variant="contained"
                size="small"
                onClick={() => handleClickOpen()}
            >
                复制apk
            </Button>
            <Modal
                title="复制APK"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                {hasPermission ? (
                    <Stack spacing={2}>
                        <Distributorinput
                            setDistributorvalue={setDistributorvalue}
                            Distributorvalue={Distributorvalue}
                        />
                        <Multymodelinput
                            Distributorvalue={Distributorvalue}
                            setModelvalue={setModelvalue}
                        />
                    </Stack>
                ) : (
                    <Stack spacing={2}>
                        <Alert
                            message="Error"
                            description="抱歉,你目前暂无权限!"
                            type="error"
                            showIcon
                        />
                    </Stack>
                )}
            </Modal>
        </React.Fragment>
    );
}
