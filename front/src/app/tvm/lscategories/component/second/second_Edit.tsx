import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import {grpcSecondEdit} from "../../api/second/grpcSecondEdit";
import {useproxy_SubClassEdit} from "../../store/second/store";
import {SubClass} from "../../../../../api/ks/v1/km_pb";

export const Second_Edit = () => {
    // 获取编辑变量
    var subclass = useproxy_SubClassEdit();
    // 获取subclasstable地址信息
    // 获取查看apk权限
    var permissions = authProxy.permissions;
    const subclasstableUrl = permissions.find(
        (option) => option.name === "查看二级分类",
    );
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // 分销商值
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<SubClass>({
        // 初始化表单数据
        defaultValues: {
            id: subclass.id,
            name: subclass.name,
            zhName: subclass.zhName,
            mainClassId: subclass.mainClassId,
            sort: subclass.sort,
            isUse: subclass.isUse,
            keyword: subclass.keyword,
            categoryId: subclass.categoryId,
        },
    });

    // 提交表单
    const onSubmit = async (data: SubClass) => {
        console.log("data", data);
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcSecondEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(
                    `${subclasstableUrl?.url}/${subclasstableUrl?.id}/${subclass.mainClassId}`,
                );
            }
        } catch (error) {
            message.error("调用接口发生错误");
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(
            `${subclasstableUrl?.url}/${subclasstableUrl?.id}/${subclass.mainClassId}`,
        );
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                onSubmit(data);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}

            <Stack spacing={2}>
                <LocationBar location={"编辑二级分类"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="zhName" label="中文名称" required/>
                <TextFieldElement name="sort" label="排序" type={"number"} required/>
                <TextFieldElement name="keyword" label="关键字" required/>
                <TextFieldElement name="categoryId" label="真实菜单分类ID" required/>
                <SelectElement
                    size={"medium"}
                    label="是否使用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
            </Stack>
            <DialogActions>
                <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={() => handleReturn()}
                >
                    <KeyboardReturnIcon color={"primary"}/>
                </IconButton>
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
