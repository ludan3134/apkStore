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
import {ClassResource} from "../../../../../api/ks/v1/km_pb";
import {useproxy_ClassResourceEdit} from "../../store/link/store";
import {grpcUpdateClassResource} from "../../api/link/grpcUpdateClassResource";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../const/uploadfile/model";

export const ClassResource_Edit = () => {
    // 获取编辑变量
    var ClassResource = useproxy_ClassResourceEdit();
    const {menuId, firstId, secondId} = useParams();
    // const [selectValue, setSelectValue] = useState<iLikeSelectValue[]>([]);
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();


    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "查看mowo三级分类",
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
    const formContext = useForm<ClassResource>({
        // 初始化表单数据
        defaultValues: {
            id: ClassResource.id,
            resourceId: ClassResource.resourceId,
            category: ClassResource.category,
            classId: ClassResource.classId,
            bannerImg: ClassResource.bannerImg,
            name: ClassResource.name,
            img: ClassResource.img,
            created: ClassResource.created,
            updated: ClassResource.updated,
            deleted: ClassResource.deleted,
            sort: ClassResource.sort,
        },
    });

    // 提交表单
    const onSubmit = async (data: ClassResource) => {
        setLoading(true);
        // console.log("selectValue",selectValue.value)
        if (apkIconRes) {
            data.bannerImg = apkIconRes.media_uri
        }
        try {
            // 执行数据更新操作
            var response = await grpcUpdateClassResource(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(`${ThirdTable?.url}/${ThirdTable?.id}/${firstId}/${secondId}`);
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
        goto(`${ThirdTable?.url}/${ThirdTable?.id}/${firstId}/${secondId}`);
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
                <LocationBar location={"mowo分类资源"}/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <Uploadfile
                    title={"背景图片"}
                    dir={"/mowo/banImge/" + Date.now().toString() + "/"}
                    setRes={setApkIconRes}
                    file_type={"ott"}
                />
                {/*<DebounceSelect*/}
                {/*    showSearch={true}*/}
                {/*    value={selectValue}*/}
                {/*    placeholder="Select users"*/}
                {/*    fetchOptions={fetchClassResourcelList}*/}
                {/*    onChange={(newValue) => {*/}
                {/*        setSelectValue(newValue as iLikeSelectValue[]);*/}
                {/*    }}*/}
                {/*    size={"large"}*/}
                {/*    style={{width: "100%"}}*/}
                {/*/>*/}
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
