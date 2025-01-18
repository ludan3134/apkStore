import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {useproxy_VodEdit,} from "../../store/level2/store";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import {Vod} from "../../../../../api/ks/v1/km_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {grpcQueryDesktopEdit} from "../../api/level2/grpcQueryDesktopEdit";
import {useproxy_Top10ManagerUrl} from "../../store/level1/store";


export const Vodsecond_EditForDistributor = () => {

    const {menuId, firstId} = useParams();

    var vodEdit = useproxy_VodEdit();
    const {t} = useTranslation();

    var recommendUrl = useproxy_Top10ManagerUrl();
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
        defaultValues: {
            id: vodEdit.id,
            categoryId: vodEdit.categoryId,
            name: vodEdit.name,
            zhName: vodEdit.zhName,
            keyword: vodEdit.keyword,
            classId: vodEdit.classId,
            sort: vodEdit.sort,
            season: vodEdit.season,
            episode: vodEdit.episode,
            streamId: vodEdit.streamId,
            tmdbId: vodEdit.tmdbId,
            cover: vodEdit.cover,
            releaseDate: vodEdit.releaseDate,
            episodeRunTime: vodEdit.episodeRunTime,
            director: vodEdit.director,
            actors: vodEdit.actors,
            description: vodEdit.description,
            country: vodEdit.country,
            genre: vodEdit.genre,
            backdropPath: vodEdit.backdropPath,
            rating: vodEdit.rating,
            language: vodEdit.language,
            duration: vodEdit.duration,
            createAt: vodEdit.createAt,
            categoryName: vodEdit.categoryName,
            className: vodEdit.className,
            distributorId: vodEdit.distributorId,
            modelId: vodEdit.modelId,
            distributorName: vodEdit.distributorName,
            modelName: vodEdit.modelName,
        },
    });

    // 提交表单
    const onSubmit = async (data: Vod) => {
        setLoading(true);
        data.backdropPath = data.backdropPath.toString().split(',').filter(item => item !== '');
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcQueryDesktopEdit(authProxy.token, data);
            if (response.status) {
                message.success("success");
                goto(recommendUrl[2] + "/" + firstId);
            }
        } catch (error) {
            message.error("error");
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
        goto(recommendUrl[2] + "/" + firstId);
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
                <TextFieldElement name="name" label={t("name")}/>
                <TextFieldElement name="zhName" label={t("zhName")}/>
                <TextFieldElement name="keyword" label={t("keyword")}/>
                <TextFieldElement name="sort" label={t("sort")} type={"number"}/>
                <TextFieldElement name="cover" label={t("cover")}/>
                <TextFieldElement name="backdropPath" label={t("backdropPath")}/>
                <TextFieldElement name="season" label={t("season")} type={"number"}/>
                <TextFieldElement name="episode" label={t("episode")} type={"number"}/>
                <TextFieldElement name="streamId" label={t("streamId")} type={"number"}/>
                <TextFieldElement name="releaseDate" label={t("releaseDate")}/>
                <TextFieldElement name="episodeRunTime" label={t("episodeRunTime")}/>
                <TextFieldElement name="director" label={t("director")}/>
                <TextFieldElement name="actors" label={t("actors")}/>
                <TextFieldElement name="description" label={t("description")}/>
                <TextFieldElement name="country" label={t("country")}/>
                <TextFieldElement name="genre" label={t("genre")}/>
                <TextFieldElement name="rating" label={t("rating")}/>
                <TextFieldElement name="language" label={t("language")}/>
                <TextFieldElement name="duration" label={t("duration")}/>
                <TextFieldElement name="title" label={t("title")}/>

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
//
