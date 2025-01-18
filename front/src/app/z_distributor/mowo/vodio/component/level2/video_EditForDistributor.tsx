import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_AllCategory, useproxy_AllOption,} from "../../../../../tsv/recommend/store/store";
import {useproxy_VideoEdit, useproxy_VideoFilter, useproxy_VideoUrl,} from "../../store/level2/store";
import {Video} from "../../../../../../api/ta/v1/tam_pb";
import {grpcVideoEdit} from "../../../../../tsv/video/api/grpcVideoEdit";
import {authProxy} from "../../../../../auth/store/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";

export const Video_EditForDistributor = () => {
    var alloption = useproxy_AllOption();
    var allCategory = useproxy_AllCategory();
    // 获取编辑变量
    var VideoEdit = useproxy_VideoEdit();
    var videoFilter = useproxy_VideoFilter();

    const {t} = useTranslation();

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
        defaultValues: {
            id: VideoEdit.id,
            title: VideoEdit.title,
            description: VideoEdit.description,
            publishedAt: VideoEdit.publishedAt,
            duration: VideoEdit.duration,
            viewCount: VideoEdit.viewCount,
            img: VideoEdit.img,
            source: VideoEdit.source,
            videoId: VideoEdit.videoId,
            url: VideoEdit.url,
            categoryId: VideoEdit.categoryId,
            sort: VideoEdit.sort,
            isRecommended: VideoEdit.isRecommended,
            classId: VideoEdit.classId,
            regionCode: VideoEdit.regionCode,
            hl: VideoEdit.hl,
            defaultLanguage: VideoEdit.defaultLanguage,
            defaultAudioLanguage: VideoEdit.defaultAudioLanguage,
            categoryName: VideoEdit.categoryName,
            className: VideoEdit.className,
            distributorId: videoFilter.distributorId,
            modelId: videoFilter.modelId,
        },
    });
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
        console.log("data", data);
        setLoading(true);
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcVideoEdit(data, authProxy.token);
            if (response.status) {
                message.success("success");
                goto(xstreamtableUrl[2]);
            }
        } catch (error) {
            message.error("error");
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    const handleResetCategory = () => {
        formContext.setValue("categoryId", null);
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
                <LocationBar location={"EDIT"}/>
                <TextFieldElement name="sort" label={t("排序")} type={"number"}/>
                <TextFieldElement name="hl" label={t("language")} disabled={true}/>
                {/*<SelectElement*/}
                {/*	label={t("选项")}*/}
                {/*	name="classId"*/}
                {/*	options={alloption}*/}
                {/*	sx={{*/}
                {/*		minWidth: "180px",*/}
                {/*	}}*/}
                {/*	required={true}*/}
                {/*	onChange={handleResetCategory}*/}

                {/*/>*/}
                {/*<SelectElement*/}
                {/*	label={t("类型")}*/}
                {/*	name="categoryId"*/}
                {/*	options={filteredCategories}*/}
                {/*	sx={{*/}
                {/*		minWidth: "180px",*/}
                {/*	}}*/}
                {/*	required={true}*/}

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
