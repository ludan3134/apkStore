import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_CategoriesEdit, useproxy_CategoriestableUrl,} from "../store/store";
import {Categories} from "../../../../api/ws/v1/wm_pb";
import {authProxy} from "../../../auth/store/store";
import {grpcCategoriesEdit} from "../api/grpcCategoriesEdit";
import LocationBar from "../../../../const/locationbar";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

export const Categories_Edit = () => {
    // 获取编辑变量
    var categories = useproxy_CategoriesEdit();
    // 获取categoriestable地址信息
    var categoriestableUrl = useproxy_CategoriestableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        categories.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>(categories.modelId);
    // 分销商值
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Categories>({
        // 初始化表单数据
        defaultValues: {
            id: categories.id,
            categoryName: categories.categoryName,
            distributorId: categories.distributorId,
            modelId: categories.modelId,
            deleted: categories.deleted,
            sort: categories.sort,
        },
    });

    // 提交表单
    const onSubmit = async (categories: Categories) => {
        categories.distributorId = Distributorvalue;
        categories.modelId = Modelvalue;
        var response = await grpcCategoriesEdit(categories, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(categoriestableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(categoriestableUrl);
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
                <LocationBar location={"编辑categories"}/>
                <TextFieldElement name="categoryName" label="分类名称" required/>
                <TextFieldElement
                    name="sort"
                    label="排序"
                    type={"number"}
                    required={true}
                    defaultValue={1}
                />
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
            </Stack>
            <DialogActions>
                <Button variant="contained" size="large" onClick={() => handleReturn()}>
                    返回上一级
                </Button>
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
