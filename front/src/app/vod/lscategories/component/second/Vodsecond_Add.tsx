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
import {Vod} from "../../../../../api/ks/v1/km_pb";
import {grpcVodSecondInsert} from "../../api/second/grpcVodSecondInsert";
import {initialVodParams,} from "../../store/second/store";

export const Vodsecond_Add = () => {
    var permissions = authProxy.permissions;
    const VodtableUrl = permissions.find(
        (option) => option.name === "查看点播二级分类",
    );
    const {firstId} = useParams();

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Vod>({
        // 初始化表单数据
        defaultValues: initialVodParams,
    });

    // 提交表单
    const onSubmit = async (data: Vod) => {
        setLoading(true);
        data.classId = parseInt(firstId)
        data.backdropPath = data.backdropPath.toString().split(',').filter(item => item !== '');
        try {
            // 执行数据更新操作
            var response = await grpcVodSecondInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(`${VodtableUrl?.url}/${VodtableUrl?.id}/${firstId}`);
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
        goto(`${VodtableUrl?.url}/${VodtableUrl?.id}/${firstId}`);
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
                <LocationBar location={"新增二级分类"}/>
                <TextFieldElement name="name" label="名称"/>
                <TextFieldElement name="zhName" label="中文名称"/>
                <TextFieldElement name="keyword" label="关键字"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <TextFieldElement name="cover" label="封面"/>
                <TextFieldElement name="backdropPath" label="剧照"/>
                <TextFieldElement name="season" label="当前季" type={"number"}/>
                <TextFieldElement name="episode" label="当前集" type={"number"}/>
                <TextFieldElement name="categoryId" label="菜单Id"/>
                <TextFieldElement name="streamId" label="点播流ID" type={"number"}/>
                <TextFieldElement name="releaseDate" label="发行日期"/>
                <TextFieldElement name="episodeRunTime" label="剧集播放时长(分钟)"/>
                <TextFieldElement name="director" label="导演"/>
                <TextFieldElement name="actors" label="演员"/>
                <TextFieldElement name="description" label="简介"/>
                <TextFieldElement name="country" label="国家"/>
                <TextFieldElement name="genre" label="类型"/>
                <TextFieldElement name="rating" label="评分"/>
                <TextFieldElement name="language" label="语言"/>
                <TextFieldElement name="duration" label="时长"/>
                <TextFieldElement name="title" label="标题"/>
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
