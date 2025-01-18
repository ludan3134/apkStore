import * as React from "react";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, message, Modal, Select, SelectProps} from "antd";
import {Button, Stack} from "@mui/material";
import {IsConfirmDialog} from "../../../../../const/alert/store";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import {
    initialAppsCopyParams,
    useproxy_allCategories,
    useproxy_allPriceplans,
    useproxy_AppCopy,
} from "../../store/app/store";
import {grpcAppsCopy} from "../../api/app/grpcAppCopy";
import {useForm} from "react-hook-form";
import {AppsCopyparams} from "../../store/app/model";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {authProxy} from "../../../../auth/store/store";

export default function App_Copy(rows) {
    var {menuId} = useParams();
    var appCopy = useproxy_AppCopy();
    console.log("我是appCopy", appCopy);

    const [open, setOpen] = React.useState(false);
    const [hasPermission, setHasPermission] = useState<Boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState();
    const [Modelvalue, setModelvalue] = useState<string>();
    const [categoriesIds, setCategoriesIds] = useState<number[]>();
    const [priceplansIds, setPriceplansIds] = useState<number[]>();
    // 分销商值
    const formContext = useForm<AppsCopyparams>({
        // 初始化表单数据
        defaultValues: initialAppsCopyParams,
    });
    // 开启对话框
    const handleClickOpen = async () => {
        setOpen(true);
        setHasPermission(true);
        // setDistributorvalue(null)
        // setModelvalue([])
        // var permissions = authProxy.permissions;
        // const childrenMenu = permissions.filter(option => option.parentId === Number(menuId));
        // let foundOption = childrenMenu.find(option => option.name === "复制APP");
        // if (foundOption) {
        //     setOpen(true)
        //     setHasPermission(true)
        // } else {
        //     setHasPermission(false)
        // }
    };

    // 回调数据给父组件
    const handleCancel = () => {
        setOpen(false);
    };
    const handleOk = async () => {
        setConfirmLoading(true);
        console.log("apps", appCopy.length);
        if (appCopy.length === 0) {
            message.error("APK选择不能为空");
            setConfirmLoading(false);
            setOpen(false);
            return;
        }
        if (
            Distributorvalue == "" ||
            Modelvalue == "" ||
            !categoriesIds ||
            !priceplansIds
        ) {
            message.error("分销商/型号/菜单分类/价格套餐不能为空!");
            setConfirmLoading(false);
            return;
        }
        var res = await grpcAppsCopy(
            appCopy,
            Distributorvalue,
            Modelvalue,
            categoriesIds,
            priceplansIds,
            authProxy.token,
        );
        res.errorMessages.forEach((errorMessage) => {
            message.error("部分更新失败记录:" + errorMessage);
        });
        if (res.status) {
            IsConfirmDialog.refleshPage = true;
            setConfirmLoading(false);
        } else {
            message.error("全部更新失败!");
        }
        setOpen(false);
    };
    const handleChangeCategories = (value: number | number[]) => {
        console.log(`Selected: ${value}`);
        setCategoriesIds(value);
    };
    const handleChangePriceplans = (value: number | number[]) => {
        console.log(`Selected: ${value}`);
        setPriceplansIds(value);
    };
    // const options: SelectProps['options'] = [];
    var allCategories = useproxy_allCategories();
    const categoriesOptions: SelectProps["options"] = allCategories.map(
        (category) => ({
            value: category.id, // 使用 allCategories 中的 value
            label: category.label, // 使用 allCategories 中的 label
        }),
    );

    var allPriceplans = useproxy_allPriceplans();
    const priceplansOptions: SelectProps["options"] = allPriceplans.map(
        (priceplans) => ({
            value: priceplans.id, // 使用 allCategories 中的 value
            label: priceplans.label, // 使用 allCategories 中的 label
        }),
    );

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
                title="复制APP"
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
                        <Modelinput
                            Distributorvalue={Distributorvalue}
                            setModelvalue={setModelvalue}
                        />
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="请选择菜单分类"
                            onChange={handleChangeCategories}
                            style={{width: "100%"}}
                            options={categoriesOptions}
                        />
                        <Select
                            mode="multiple"
                            size={"large"}
                            placeholder="请选择价格套餐"
                            onChange={handleChangePriceplans}
                            style={{width: "100%"}}
                            options={priceplansOptions}
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
