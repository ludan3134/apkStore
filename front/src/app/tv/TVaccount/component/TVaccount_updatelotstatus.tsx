import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";

import {Alert, message, Modal, Select} from "antd";
import {Button, Stack} from "@mui/material";
import {authProxy} from "../../../auth/store/store";
import {IsConfirmDialog} from "../../../../const/alert/store";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Lotinput from "../../../../const/distributortomodel/component/tv/component/lotinput";
import {grpcTVAccountUpdateAll} from "../api/grpcTVAccountUpdateAll";

export default function TVaccount_updatelotstatus(rows) {
    var {menuId} = useParams();

    const [open, setOpen] = React.useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState();
    const [lotvalue, setLotvalue] = useState();
    const [IsActive, setIsActive] = useState();
    const [IsService, setIsService] = useState();
    const [IsAuth, setIsAuth] = useState();
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
            (option) => option.name === "批量创建XC账户",
        );
        if (!foundOption) {
            setOpen(true);
            setHasPermission(true);
        } else {
            setHasPermission(false);
        }
    };
    const handleIsActiveChange = (value: string) => {
        console.log(`selected ${value}`);
        setIsActive(value);
    };
    const handleIsServiceChange = (value: string) => {
        console.log(`selected ${value}`);
        setIsService(value);
    };
    const handleIsAuth = (value: string) => {
        console.log(`selected ${value}`);
        setIsAuth(value);
    };

    // 回调数据给父组件
    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = async () => {
        console.log("Distributorvalue", Distributorvalue);
        console.log("lotvalue", lotvalue);
        console.log("IsActive", IsActive);
        console.log("IsService", IsService);
        console.log("IsAuth", IsAuth);

        if (!Distributorvalue || !lotvalue) {
            message.error("分销商/批次不能为空!");
            return;
        }
        setConfirmLoading(true);
        const res = await grpcTVAccountUpdateAll(
            Distributorvalue,
            lotvalue,
            IsActive,
            IsService,
            IsAuth,
            authProxy.token,
        );
        if (res.status) {
            message.success("批量更新成功!");
            IsConfirmDialog.refleshPage = true;
        }
        setDistributorvalue(null);
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
                批量激活用户状态
            </Button>
            <Modal
                title="批量激活用户状态"
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
                        <Select
                            defaultValue={"未激活"}
                            style={{width: 120}}
                            placeholder="是否激活"
                            onChange={handleIsActiveChange}
                            options={[
                                {value: true, label: "激活"},
                                {value: false, label: "不激活"},
                            ]}
                        />
                        <Select
                            defaultValue={"未服务"}
                            style={{width: 120}}
                            onChange={handleIsServiceChange}
                            placeholder="是否服务"
                            options={[
                                {value: true, label: "服务"},
                                {value: false, label: "不服务"},
                            ]}
                        />
                        <Select
                            defaultValue={"未授权"}
                            style={{width: 120}}
                            onChange={handleIsAuth}
                            placeholder="是否服务"
                            options={[
                                {value: true, label: "授权"},
                                {value: false, label: "未授权"},
                            ]}
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
