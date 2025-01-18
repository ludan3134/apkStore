import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, IconButton, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {initialVideoParams, useproxy_VideoFilter, useproxy_VideoUrl,} from "../../store/level2/store";
import {Video} from "../../../../../../api/ta/v1/tam_pb";
import {grpcVideoParse} from "../../../../../tsv/video/api/grpcVideoParse";
import {authProxy} from "../../../../../auth/store/store";
import {grpcVideoInsert} from "../../../../../tsv/video/api/grpcVideoInsert";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import SyncIcon from "@mui/icons-material/Sync";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {useTranslation} from "react-i18next";
import i18n from "../../../../../../i18n/i18n";

export const Video_AddForDistributor = () => {
    // var alloption = useproxy_AllOption();
    // var allCategory = useproxy_AllCategory();
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_VideoUrl();
    const {t} = useTranslation(); // 请求是否成功
    const [loading, setLoading] = useState(false);
    // const [filteredCategories, setFilteredCategories] = useState(allCategory);

    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    var videoFilter = useproxy_VideoFilter();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    var language = i18n.language;
    console.log("当前语言", language);
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Video>({
        // 初始化表单数据
        defaultValues: initialVideoParams,
    });
    var watchValue = formContext.watch(["videoId", "hl", "classId"]);
    const handlsyncVideo = async () => {
        setLoading(true);
        console.log("watchValue", watchValue);
        var res = await grpcVideoParse(language, watchValue[0], authProxy.token);
        if (res.status && res.video) {
            formContext.setValue("title", res.video.title);
            formContext.setValue("description", res.video.description);
            formContext.setValue("duration", res.video.duration);
            formContext.setValue("viewCount", res.video.viewCount);
            formContext.setValue("img", res.video.img);
            formContext.setValue("url", res.video.url);
            formContext.setValue("defaultLanguage", res.video.defaultLanguage);
            formContext.setValue("publishedAt", res.video.publishedAt);
            formContext.setValue("source", res.video.source);
            formContext.setValue(
                "defaultAudioLanguage",
                res.video.defaultAudioLanguage,
            );
        } else {
            message.error("error");
        }
        setLoading(false);
        return true; // 添加返回 true 停止循环
    };
    // useEffect(() => {
    // 	// 假设 allCategory 是一个对象数组，每个对象都有一个 classId 属性
    // 	// 根据 classId 筛选类别选项
    // 	const selectedClassId = formContext.watch("classId");
    // 	const newFilteredCategories = allCategory.filter(
    // 		(category) => category.classId === selectedClassId
    // 	);
    // 	setFilteredCategories(newFilteredCategories);
    // 	formContext.setValue("categoryId",null)
    // }, [formContext.watch("classId"), allCategory]);
    // 提交表单
    const onSubmit = async (data: Video) => {
        console.log("sort", data.sort);
        setLoading(true);
        data.distributorId = videoFilter.distributorId;
        data.modelId = videoFilter.modelId;
        data.classId = videoFilter.classId;
        data.categoryId = videoFilter.categoryId;
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcVideoInsert(data, authProxy.token);
            if (response.status) {
                message.success("success");
                goto(xstreamtableUrl[2]);
            }
        } catch (error) {
            message.error("error");
            setLoading(false);
            return;
        }
        goto(xstreamtableUrl[2]);
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(xstreamtableUrl[2]);
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
                <LocationBar location={"ADD"}/>

                <Stack direction={"row"}>
                    <TextFieldElement name="videoId" label="YoutubeID" required={true}/>
                    <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handlsyncVideo()}
                    >
                        {t("解析")}
                        <SyncIcon color="primary"/>
                    </IconButton>
                </Stack>
                <TextFieldElement name="hl" label={t("language")} disabled={true}/>

                <TextFieldElement name="title" label={t("name")} disabled={true}/>
                <TextFieldElement
                    name="publishedAt"
                    label={t("releaseYear")}
                    disabled={true}
                />
                <TextFieldElement
                    name="viewCount"
                    label={t("浏览量")}
                    disabled={true}
                />
                <TextFieldElement
                    name="duration"
                    label={t("duration")}
                    disabled={true}
                />
                <TextFieldElement name="sort" label={t("排序")} type={"number"}/>
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
                    {t("submit")}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    type="button"
                    onClick={() => handleResetForm()}
                    color={"error"}
                >
                    {t("reset")}
                </Button>
            </DialogActions>
        </FormContainer>
    );
};
