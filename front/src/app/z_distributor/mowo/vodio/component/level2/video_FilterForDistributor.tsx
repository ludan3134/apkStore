import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {VideoStoreproxy} from "../../store/level2/store";
import {useproxy_AllCategory, useproxy_AllOption,} from "../../../../../tsv/recommend/store/store";
import {IsConfirmDialog} from "../../../../../../const/alert/store";
import {Video} from "../../../../../../api/ta/v1/tam_pb";
import {useTranslation} from "react-i18next";

const Video_FilterForDistributor = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Video>({
        defaultValues: {},
    });
    const {t} = useTranslation();

    var alloption = useproxy_AllOption();
    var allCategory = useproxy_AllCategory();
    const [filteredCategories, setFilteredCategories] = useState(allCategory);
    console.log("allCategory", allCategory);
    var distributorId = VideoStoreproxy.VideoFilter.distributorId;
    var modelId = VideoStoreproxy.VideoFilter.modelId;
    var classId = VideoStoreproxy.VideoFilter.classId;
    var categoryId = VideoStoreproxy.VideoFilter.categoryId;
    const handleSubFormSubmit = (data: Video) => {
        data.distributorId = distributorId;
        data.modelId = modelId;
        data.categoryId = categoryId;
        data.classId = classId;
        VideoStoreproxy.VideoFilter = data;
        IsConfirmDialog.refleshPage = false;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        VideoStoreproxy.VideoFilter = {
            distributorId: distributorId,
            modelId: modelId,
            categoryId: categoryId,
            classId: classId,
        } as Video;
        IsConfirmDialog.refleshPage = true;
    };
    // useEffect(() => {
    // 	// 假设 allCategory 是一个对象数组，每个对象都有一个 classId 属性
    // 	// 根据 classId 筛选类别选项
    // 	const selectedClassId = formContext.watch("classId");
    // 	const newFilteredCategories = allCategory.filter(
    // 		(category) => category.classId === selectedClassId
    // 	);
    // 	setFilteredCategories(newFilteredCategories);
    // }, [formContext.watch("classId"), allCategory]);
    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}
        >
            <Stack direction="row" spacing={1}>
                <TextFieldElement name="title" label={t("name")}/>
                <TextFieldElement name="videoId" label="YoutubeID"/>
                <TextFieldElement name="hl" label={t("language")}/>
                {/*<SelectElement*/}
                {/*	label={t("选项")}*/}
                {/*	name="classId"*/}
                {/*	options={alloption}*/}
                {/*	sx={{*/}
                {/*		minWidth: "180px",*/}
                {/*	}}*/}
                {/*/>*/}
                {/*<SelectElement*/}
                {/*	label={t("类型")}*/}

                {/*	name="categoryId"*/}
                {/*	options={filteredCategories}*/}
                {/*	sx={{*/}
                {/*		minWidth: "180px",*/}
                {/*	}}*/}
                {/*/>*/}
                {/*<Stack*/}
                {/*	sx={{minWidth: "300px"}}*/}
                {/*>*/}
                {/*	<Distributor2Model/>*/}
                {/*</Stack>*/}

                <Button type="submit">{t("筛选")}</Button>
                <Button type="button" onClick={handleResetForm}>
                    {t("reset")}
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Video_FilterForDistributor;
