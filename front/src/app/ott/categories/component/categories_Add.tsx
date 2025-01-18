import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {
    initialApkCategoryfilterParams,
    useproxy_ApkCategorysFilter,
    useproxy_ApkCategorytableUrl,
} from "../store/store";
import LocationBar from "../../../../const/locationbar";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";
import {grpcApkCategoryInsert} from "../api/grpcCategoriesInsert";
import {grpcAllCategories} from "../api/grpcAllCategories";
import {ApkCategoryLabel} from "../../../../api/fs/v1/fs_pb";

export const ApkCategory_Add = () => {
    // 获取ApkCategorytable地址信息
    var ApkCategorytableUrl = useproxy_ApkCategorytableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 筛选条件
    var ApkCategorysFilter = useproxy_ApkCategorysFilter();
    const [parent, setParent] = useState<ApkCategoryLabel[]>()
    var apkCategorytableUrl = useproxy_ApkCategorytableUrl();

    const formContext = useForm<ApkCategory>({
        // 初始化表单数据
        defaultValues: initialApkCategoryfilterParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (data: ApkCategory) => {
        if (ApkCategorysFilter.parentId === undefined || ApkCategorysFilter.parentId === "") {
            data.parentId = "0";
        } else {
            data.parentId = ApkCategorysFilter.parentId
        }
        try {
            // 执行数据插入操作
            var res = await grpcApkCategoryInsert(data, authProxy.token);
            if (res.status) {
                setLoading(false);
                message.success("插入数据成功");
                handleResetForm();
                goto(apkCategorytableUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    useEffect(() => {
        const fetchParent = async () => {
            try {
                // 调用grpcAllCategories函数获取数据
                const res = await grpcAllCategories(authProxy.token, ApkCategorysFilter);
                // 使用setParent更新状态
                setParent(res.apkCategoryLabel);
            } catch (error) {
                // 处理错误情况
                console.error("Failed to fetch parent category:", error);
                // 可能需要设置错误状态或显示错误消息
            }
        };

        // 调用fetchParent函数
        fetchParent();
    }, []); // 空依赖数组表示这个effect只在组件挂载时运行一次
    // 表单重置
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
    };
    const handleReturn = () => {
        goto(apkCategorytableUrl);
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
                <LocationBar location={"新增分类"}/>
                <TextFieldElement name="categoryName" label="分类名称" required/>
                <TextFieldElement
                    name="sort"
                    label="排序"
                    type={"number"}
                    required={true}
                    defaultValue={1}
                />
                {ApkCategorysFilter.parentId === "0" && ApkCategorysFilter.parentId === "" && (
                    <SelectElement
                        size={"medium"}
                        label="主分类"
                        name="parentId"
                        options={parent}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                )}

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
                {ApkCategorysFilter.parentId && (
                    <Button variant="contained" size="large" onClick={() => handleReturn()}>
                        返回上一级
                    </Button>
                )}
            </DialogActions>
        </FormContainer>
    );
};
