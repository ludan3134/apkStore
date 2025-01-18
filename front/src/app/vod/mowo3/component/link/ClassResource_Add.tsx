import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {ClassResource, ClassResourceLabel} from "../../../../../api/ks/v1/km_pb";
import {grpcInsertClassResource} from "../../api/link/grpcInsertClassResource";
import {iLikeSelectValue} from "../../../../../const/ilikeselect";
import {DebounceSelect} from "../../../../tvm/epg/component/epg_bindChannel";
import {grpcQueryAllResourceByClassId} from "../../api/link/grpcQueryAllResourceByClassId";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../const/uploadfile/model";

export async function fetchClassResourcelList(
    secondId: number,
    channelname: string,
): Promise<iLikeSelectValue[]> {
    try {
        var res = await grpcQueryAllResourceByClassId(secondId, channelname, authProxy.token);
        // 确保 res.priceLabelList 是 AllPricePlanLabel 类型的数组
        return res.list.map((item: ClassResourceLabel) => ({
            label: item.name,
            value: item.id,
            title: item.title,
        }));
    } catch (error) {
        console.error("Fetching channel list failed:", error);
        return [];
    }
}

export const ClassResource_Add = () => {
    const {menuId, firstId, secondId} = useParams();
    const [selectValue, setSelectValue] = useState<iLikeSelectValue>();
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();

    // 获取编辑变量
    var permissions = authProxy.permissions;
    const ClassResourceTable = permissions.find(
        (option) => option.name === "查看mowo三级分类",
    );

    // 请求是否成功
    const [loading, setLoading] = useState(false);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ClassResource>({
        // 初始化表单数据
        defaultValues: {},
    });

    // 提交表单
    const onSubmit = async (data: ClassResource) => {
        data.classId = parseInt(secondId)
        if (!selectValue?.value) {
            message.error("请选中资源Id");
            setLoading(false);
            return;
        }
        data.resourceId = selectValue?.value
        data.category = selectValue?.title
        // if (!apkIconRes) {
        //     message.error("请选中apkIcon图片");
        //     setLoading(false);
        //     return;
        // }
        data.bannerImg = apkIconRes?.media_uri
        setLoading(true);
        try {
            var response = await grpcInsertClassResource(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(`${ClassResourceTable?.url}/${ClassResourceTable?.id}/${firstId}/${secondId}`);
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
        setSelectValue(null)
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(`${ClassResourceTable?.url}/${ClassResourceTable?.id}/${firstId}/${secondId}`);
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

            <Stack spacing={2}>
                <LocationBar location={"新增mowo分类资源"}/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <DebounceSelect
                    showSearch={true}
                    value={selectValue}
                    placeholder="请选择资源"
                    fetchOptions={(search) => fetchClassResourcelList(parseInt(secondId), search)} // 传递额外的值
                    onChange={(newValue) => {
                        console.log("newValue", newValue)
                        setSelectValue(newValue as iLikeSelectValue);
                    }}
                    size={"large"}
                    style={{width: "100%"}}
                />
                <Uploadfile
                    title={"背景图片"}
                    dir={"/mowo/banImge/" + Date.now().toString() + "/"}
                    setRes={setApkIconRes}
                    file_type={"ott"}
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
