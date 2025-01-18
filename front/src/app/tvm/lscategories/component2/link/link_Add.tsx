import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {DecodeOption, IsBoolOption} from "../../../../../const/option";
import {Link} from "../../../../../api/ks/v1/km_pb";
import {initialLinkCalssParams} from "../../store/link/store";
import {grpclinkInsert} from "../../api/link/grpclinkInsert";

export const Link_Add = () => {
    const {mid, fid, channerId} = useParams();

    // 获取编辑变量
    var permissions = authProxy.permissions;
    const LinkTable = permissions.find(
        (option) => option.name === "展示频道链接",
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
    const formContext = useForm<Link>({
        // 初始化表单数据
        defaultValues: initialLinkCalssParams,
    });

    // 提交表单
    const onSubmit = async (data: Link) => {
        data.mainClassId = Number(mid);
        data.subClassId = Number(fid);
        data.channelId = Number(channerId);
        setLoading(true);
        try {
            var response = await grpclinkInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                console.log(channerId, mid, fid);
                // 12418 25 575
                goto(`${LinkTable?.url}/${LinkTable?.id}/${channerId}/${mid}/${fid}`);
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
        goto(`${LinkTable?.url}/${LinkTable?.id}/${channerId}/${mid}/${fid}`);
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
                <TextFieldElement name="link" label="链接" required/>
                <TextFieldElement name="source" label="资源" required/>
                <TextFieldElement name="method" label="解析算法"/>
                <TextFieldElement name="keyword" label="关键字" required/>
                <SelectElement
                    size={"medium"}
                    label="是否可用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="解密方式"
                    name="decode"
                    options={DecodeOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="脚本开关"
                    name="scriptDeal"
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
