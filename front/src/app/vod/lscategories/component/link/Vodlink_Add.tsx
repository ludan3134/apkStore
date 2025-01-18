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
import {initialVodLinkCalssParams} from "../../store/link/store";
import {grpcVodVodLinkInsert} from "../../api/link/grpcVodlinkInsert";

export const VodVodLink_Add = () => {
    const {menuId, firstId, secondId} = useParams();
    // 获取编辑变量
    var permissions = authProxy.permissions;
    const VodLinkTable = permissions.find(
        (option) => option.name === "查看点播链接",
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
    const formContext = useForm<VodLink>({
        // 初始化表单数据
        defaultValues: initialVodLinkCalssParams,
    });

    // 提交表单
    const onSubmit = async (data: VodLink) => {
        data.vid = parseInt(secondId)
        // data.channelId = Number(channerId);
        setLoading(true);
        try {
            var response = await grpcVodVodLinkInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                // 12418 25 575
                goto(`${VodLinkTable?.url}/${VodLinkTable?.id}/${firstId}/${secondId}`);
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
        goto(`${VodLinkTable?.url}/${VodLinkTable?.id}/${firstId}/${secondId}`);
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
                <LocationBar location={"新增频道链接"}/>
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
