import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {DecodeOption, IsBoolOption} from "../../../../../const/option";
import {Link} from "../../../../../api/ks/v1/km_pb";
import {useproxy_LinkCalssEdit} from "../../store/link/store";
import {grpclinkEdit} from "../../api/link/grpclinkEdit";

export const Link_Edit = () => {
    // 获取编辑变量
    var Linkclass = useproxy_LinkCalssEdit();

    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "展示频道链接",
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
    const formContext = useForm<Link>({
        // 初始化表单数据
        defaultValues: {
            id: Linkclass.id,
            channelId: Linkclass.channelId,
            link: Linkclass.link,
            sort: Linkclass.sort,
            isUse: Linkclass.isUse,
            scriptDeal: Linkclass.scriptDeal,
            method: Linkclass.method,
            decode: Linkclass.decode,
            mainClassId: Linkclass.mainClassId,
            subClassId: Linkclass.subClassId,
            keyword: Linkclass.keyword,
            source: Linkclass.source,
            interval: Linkclass.interval,
            maxRetry: Linkclass.maxRetry,
            timeout: Linkclass.timeout,
        },
    });

    // 提交表单
    const onSubmit = async (data: Link) => {
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpclinkEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(
                    `${ThirdTable?.url}/${ThirdTable?.id}/${Linkclass.channelId}/${Linkclass.mainClassId}/${Linkclass.subClassId}`,
                );
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
        goto(
            `${ThirdTable?.url}/${ThirdTable?.id}/${Linkclass.channelId}/${Linkclass.mainClassId}/${Linkclass.subClassId}`,
        );
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
                <TextFieldElement name="link" label="链接" required/>
                <TextFieldElement name="source" label="来源" required/>
                <TextFieldElement name="method" label="解析算法"/>
                <TextFieldElement name="keyword" label="关键字" required/>=
                <TextFieldElement
                    name="interval"
                    label="interval"
                    type={"number"}
                    required
                />
                <TextFieldElement
                    name="maxRetry"
                    label="maxRetry"
                    type={"number"}
                    required
                />
                <TextFieldElement
                    name="timeout"
                    label="timeout"
                    type={"number"}
                    required
                />

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
