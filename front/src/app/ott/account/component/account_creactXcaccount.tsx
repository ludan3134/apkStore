import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";

import {Alert, Modal} from "antd";
import {Button, Stack} from "@mui/material";
import {useproxy_ApkCopy} from "../../apk/store/apk/store";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Lotinput from "../../../../const/distributortomodel/component/ott/component/lotinput";
import {authProxy} from "../../../auth/store/store";

export default function Account_creactXcaccount(rows) {
    var {menuId} = useParams();
    var apks = useproxy_ApkCopy();

    const [open, setOpen] = React.useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState();
    const [lotvalue, setLotvalue] = useState();
    // 分销商值

    // 开启对话框
    const handleClickOpen = async () => {
        setDistributorvalue(null);
        setLotvalue(null);
        var permissions = authProxy.permissions;
        const childrenMenu = permissions.filter(
            (option) => option.parentId === Number(menuId),
        );
        let foundOption = childrenMenu.find(
            (option) => option.name === "创建单个XC用户账号",
        );
        if (!foundOption) {
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
        console.log("Distributorvalue", Distributorvalue);
        console.log("lotvalue", lotvalue);
        setConfirmLoading(true);
        setLotvalue(null);
        setOpen(false);
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
                单个创建XC账户
            </Button>
            <Modal
                title="单个创建XC账户"
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
                        <Lotinput
                            Distributorvalue={Distributorvalue}
                            seLotvalue={setLotvalue}
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
