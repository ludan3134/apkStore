import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_ClassInfoEdit, useproxy_ClassInfoUrl} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {grpcOptionEdit} from "../api/grpcOptionEdit";
import {ClassInfo} from "../../../../api/ta/v1/tam_pb";

export const Option_Edit = () => {
    // 获取编辑变量
    var ClassInfoEdit = useproxy_ClassInfoEdit();

    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_ClassInfoUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ClassInfo>({
        // 初始化表单数据
        defaultValues: {
            id: ClassInfoEdit.id,
            name: ClassInfoEdit.name,
            zhName: ClassInfoEdit.zhName,
            sort: ClassInfoEdit.sort,
            topTitle: ClassInfoEdit.topTitle,
            middleTitle: ClassInfoEdit.middleTitle,
            bottomTitle: ClassInfoEdit.bottomTitle,
        },
    });

    // 提交表单
    const onSubmit = async (data: ClassInfo) => {
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcOptionEdit(data, authProxy.token);
            if (response.status) {
                message.success("编辑成功");
                goto(xstreamtableUrl);
            }
        } catch (error) {
            message.error("调用接口失败");
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
        goto(xstreamtableUrl);
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
                <LocationBar location={"编辑XCClassInfo"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="zhName" label="中文名称" required/>
                <TextFieldElement name="sort" label="排序" type={"number"} required/>
                <TextFieldElement name="topTitle" label="顶部标题"/>
                <TextFieldElement name="middleTitle" label="中部标题"/>
                <TextFieldElement name="bottomTitle" label="底部标题"/>
            </Stack>
            <DialogActions>
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
