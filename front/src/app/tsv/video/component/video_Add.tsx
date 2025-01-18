import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, IconButton, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {initialVideoParams, useproxy_VideoUrl} from "../store/store";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {grpcVideoInsert} from "../api/grpcVideoInsert";
import {Video} from "../../../../api/ta/v1/tam_pb";
import {IsDistributorOption} from "../../../../const/option";
import {useproxy_AllCategory, useproxy_AllOption,} from "../../recommend/store/store";
import SyncIcon from "@mui/icons-material/Sync";
import {grpcVideoParse} from "../api/grpcVideoParse";

export const Video_Add = () => {
    var alloption = useproxy_AllOption();
    var allCategory = useproxy_AllCategory();
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_VideoUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    const [filteredCategories, setFilteredCategories] = useState(allCategory);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Video>({
        // 初始化表单数据
        defaultValues: initialVideoParams,
    });
    var watchValue = formContext.watch(["videoId", "hl"]);
    const handlsyncVideo = async () => {
        setLoading(true);
        console.log("watchValue", watchValue);
        var res = await grpcVideoParse(
            watchValue[1],
            watchValue[0],
            authProxy.token,
        );
        if (res.status && res.video) {
            formContext.setValue("title", res.video.title);
            formContext.setValue("description", res.video.description);
            formContext.setValue("duration", res.video.duration);
            formContext.setValue("viewCount", res.video.viewCount);
            formContext.setValue("img", res.video.img);
            formContext.setValue("url", res.video.url);
            formContext.setValue("sort", res.video.sort);
            formContext.setValue("regionCode", res.video.regionCode);
            formContext.setValue("defaultLanguage", res.video.defaultLanguage);
            formContext.setValue("publishedAt", res.video.publishedAt);
            formContext.setValue("source", res.video.source);
            formContext.setValue("hl", res.video.hl);
        } else {
            message.error("解析数据为空");
        }
        setLoading(false);
        return true; // 添加返回 true 停止循环
    };
    useEffect(() => {
        // 假设 allCategory 是一个对象数组，每个对象都有一个 classId 属性
        // 根据 classId 筛选类别选项
        const selectedClassId = formContext.watch("classId");
        const newFilteredCategories = allCategory.filter(
            (category) => category.classId === selectedClassId,
        );
        setFilteredCategories(newFilteredCategories);
    }, [formContext.watch("classId"), allCategory]);
    // 提交表单
    const onSubmit = async (data: Video) => {
        console.log("sort", data.sort);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcVideoInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
                goto(xstreamtableUrl);
            }
        } catch (error) {
            message.error("调用接口失败");
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
        goto(xstreamtableUrl);
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
                <LocationBar location={"新增XCVideo"}/>

                <Stack direction={"row"}>
                    <TextFieldElement name="videoId" label="YoutubeID"/>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handlsyncVideo()}
                    >
                        解析
                        <SyncIcon color="primary"/>
                    </IconButton>
                </Stack>

                <TextFieldElement name="hl" label="语言"/>
                <TextFieldElement name="title" label="标题"/>
                <TextFieldElement name="description" label="简介"/>
                <TextFieldElement name="publishedAt" label="发布年份"/>
                <TextFieldElement name="duration" label="时长"/>
                <TextFieldElement name="viewCount" label="浏览量"/>
                <TextFieldElement name="img" label="图片"/>
                <TextFieldElement name="source" label="来源"/>
                <TextFieldElement name="url" label="youtube地址"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <TextFieldElement name="regionCode" label="地区"/>
                <TextFieldElement name="defaultLanguage" label="默认语言"/>
                <SelectElement
                    label="是否推荐"
                    name="isRecommended"
                    options={IsDistributorOption}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                <SelectElement
                    label="选项"
                    name="classId"
                    options={alloption}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                <SelectElement
                    label="菜单"
                    name="categoryId"
                    options={filteredCategories}
                    sx={{
                        minWidth: "180px",
                    }}
                />
            </Stack>
            <DialogActions>
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
