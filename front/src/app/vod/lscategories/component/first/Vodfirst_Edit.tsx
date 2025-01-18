import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {grpcVodfirstEdit} from "../../api/first/grpcVodfirstEdit";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {isPayOption} from "../../../../../const/option";
import {VodClass} from "../../../../../api/ks/v1/km_pb";
import {useproxy_VodClassEdit, useproxy_VodClasstableUrl,} from "../../store/first/store";

export const Vodfirst_Edit = () => {
    // 获取编辑变量
    var vodclass = useproxy_VodClassEdit();
    // 获取vodclasstable地址信息
    var vodclasstableUrl = useproxy_VodClasstableUrl();
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
    const formContext = useForm<VodClass>({
        // 初始化表单数据
        defaultValues: {
            id: vodclass.id,
            name: vodclass.name,
            zhName: vodclass.zhName,
            keyword: vodclass.keyword,
            isPay: vodclass.isPay,
            price: vodclass.price,
            trialTime: vodclass.trialTime,
            sort: vodclass.sort,
            ext: vodclass.ext,
            created: vodclass.created,
            updated: vodclass.updated,
            vodNum: vodclass.vodNum,
            deleted: vodclass.deleted,
            multiLang: vodclass.multiLang,
        },
    });

    // 提交表单
    const onSubmit = async (data: VodClass) => {
        console.log("data", data);
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcVodfirstEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(vodclasstableUrl);
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
        goto(vodclasstableUrl);
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

            <LocationBar location={"编辑一级分类"}/>
            <Stack spacing={2}>
                <TextFieldElement name="name" label="名称"/>
                <TextFieldElement name="zhName" label="中文名称"/>
                <TextFieldElement name="keyword" label="关键字"/>
                <TextFieldElement name="price" label="价格" type={"number"}/>
                <TextFieldElement
                    name="trialTime"
                    label="免费试看时间"
                    type={"number"}
                />
                <TextFieldElement name="multiLang" label="多语言"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <SelectElement
                    size={"medium"}
                    label="支付情况"
                    name="isPay"
                    options={isPayOption}
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
