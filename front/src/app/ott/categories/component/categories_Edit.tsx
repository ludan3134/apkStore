import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_ApkCategoryEdit, useproxy_ApkCategorysFilter, useproxy_ApkCategorytableUrl,} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import LocationBar from "../../../../const/locationbar";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import {grpcApkCategoryEdit} from "../api/grpcCategoriesEdit";
import {ApkCategory} from "../../../../api/fs/v1/fm_pb";
import {ApkCategoryLabel} from "../../../../api/fs/v1/fs_pb";
import {grpcAllCategories} from "../api/grpcAllCategories";

export const ApkCategory_Edit = () => {
    // 获取编辑变量
    var ApkCategory = useproxy_ApkCategoryEdit();
    console.log("ApkCategoryAAAAA", ApkCategory)
    // 获取ApkCategorytable地址信息
    var ApkCategorytableUrl = useproxy_ApkCategorytableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    var ApkCategorysFilter = useproxy_ApkCategorysFilter();
    console.log("ApkCategorysFilter.parentId", ApkCategorysFilter.parentId)
    const [parent, setParent] = useState<ApkCategoryLabel[]>()

    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkCategory>({
        // 初始化表单数据
        defaultValues: {
            id: ApkCategory.id,
            categoryName: ApkCategory.categoryName,
            deleted: ApkCategory.deleted,
            sort: ApkCategory.sort,
            parentId: ApkCategory.parentId
        },
    });
    useEffect(() => {
        const fetchParent = async () => {
            try {
                // 调用grpcAllCategories函数获取数据
                const res = await grpcAllCategories(authProxy.token, "0");
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
    // 提交表单
    const onSubmit = async (ApkCategory: ApkCategory) => {
        debugger
        if (ApkCategory.parentId === "0") {
            ApkCategory.parentId = ApkCategorysFilter.parentId;
        }
        console.log("CCC", ApkCategory.parentId)
        var response = await grpcApkCategoryEdit(ApkCategory, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(ApkCategorytableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    // const handleReturn = () => {
    //     goto(ApkCategorytableUrl);
    // };

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
                <LocationBar location={"编辑ApkCategory"}/>
                <TextFieldElement name="categoryName" label="分类名称" required/>
                <TextFieldElement
                    name="sort"
                    label="排序"
                    type={"number"}
                    required={true}
                    defaultValue={1}
                />
                {!(ApkCategorysFilter.parentId === "0" || ApkCategorysFilter.parentId === "") && (
                    <SelectElement
                        size="medium"
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
                {/*<Button variant="contained" size="large" onClick={() => handleReturn()}>*/}
                {/*    返回上一级*/}
                {/*</Button>*/}
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
