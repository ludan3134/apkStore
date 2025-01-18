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
import {IsBoolOption, TvmrebroadcastUseFlagOption,} from "../../../../../const/option";
import {initialThirdCalssParams} from "../../store/third/store";
import {Channel} from "../../../../../api/ks/v1/km_pb";
import {grpcThirdInsert} from "../../api/third/grpcThirdInsert";

export const Third_Add = () => {
    const {mid, fid} = useParams();

    // 获取编辑变量
    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // const [imageRes, setImageRes] = useState<UploadResponse>()

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Channel>({
        // 初始化表单数据
        defaultValues: initialThirdCalssParams,
    });

    // 提交表单
    const onSubmit = async (data: Channel) => {
        data.mainClassId = Number(mid);
        data.subClassId = Number(fid);
        console.log("data", data);
        setLoading(true);
        try {
            // 执行数据更新操作
            // if (!imageRes || !imageRes) {
            //     message.error("请选中上传图片")
            //     setLoading(false);
            //     return;
            // }
            var response = await grpcThirdInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(`${ThirdTable?.url}/${ThirdTable?.id}/${fid}/${mid}`);
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
        goto(`${ThirdTable?.url}/${ThirdTable?.id}/${fid}/${mid}`);
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
                <LocationBar location={"新增频道"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="zhName" label="中文名称" required/>
                <TextFieldElement name="keyword" label="关键字" required/>
                <TextFieldElement name="sort" label="排序" type={"number"} required/>
                <TextFieldElement
                    name="streamId"
                    label="streamId"
                    type={"number"}
                    required
                />
                <TextFieldElement name="aliasName" label="别名" required/>
                <TextFieldElement name="image" label="图片" required/>

                {/*<Uploadfile title={"频道图片"} dir={"/channel/" + Date.now().toString() + "/"}*/}
                {/*            setRes={setImageRes} file_type={null}/>*/}
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
                    label="是否推荐"
                    name="isRecommend"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否加密"
                    name="isAdult"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="重播标志"
                    name="rebroadcastUseFlag"
                    options={TvmrebroadcastUseFlagOption}
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
