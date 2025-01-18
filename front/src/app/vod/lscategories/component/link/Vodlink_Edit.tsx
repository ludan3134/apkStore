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
import {VodLink} from "../../../../../api/ks/v1/km_pb";
import {useproxy_VodLinkCalssEdit} from "../../store/link/store";
import {grpcVodVodLinkEdit} from "../../api/link/grpcVodlinkEdit";

export const VodVodLink_Edit = () => {
    // 获取编辑变量
    var vodlink = useproxy_VodLinkCalssEdit();
    const {menuId, firstId, secondId} = useParams();

    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "查看点播链接",
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
    const formContext = useForm<VodLink>({
        // 初始化表单数据
        defaultValues: {
            id: vodlink.id,
            vid: vodlink.vid,
            link: vodlink.link,
            episode: vodlink.episode,
            season: vodlink.season,
            keyword: vodlink.keyword,
            classId: vodlink.classId,
            categoryId: vodlink.categoryId,
        },
    });

    // 提交表单
    const onSubmit = async (data: VodLink) => {
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcVodVodLinkEdit(data, authProxy.token);
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
                <LocationBar location={"编辑频道链接"}/>
                <TextFieldElement name="season" label="当前季" type={"number"} required/>
                <TextFieldElement name="episode" label="当前集" type={"number"} required/>
                <TextFieldElement name="link" label="链接" required/>
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
