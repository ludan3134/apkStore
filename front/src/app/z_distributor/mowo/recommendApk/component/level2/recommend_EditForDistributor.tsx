import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {
    useproxy_AllOption,
    useproxy_RecommendEdit,
    useproxy_RecommendFilter,
    useproxy_RecommendUrl,
} from "../../store/level2/store";
import {UploadResponse} from "../../../../../../const/uploadfile/model";
import {RecommendApk} from "../../../../../../api/ta/v1/tam_pb";
import {grpcRecommendEdit} from "../../../../../tsv/recommend/api/grpcRecommendEdit";
import {authProxy} from "../../../../../auth/store/store";
import CircularIndeterminate from "../../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../../const/locationbar";
import Uploadfile from "../../../../../../const/uploadfile/uploadfile";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";

export const Recommend_EditForDistributor = () => {
    // 获取编辑变量
    var RecommendEdit = useproxy_RecommendEdit();
    console.log("RecommendEdit", RecommendEdit);
    const {t} = useTranslation();
    var recommendFilter = useproxy_RecommendFilter();

    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_RecommendUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const [apkRecommend, setApkRecommend] = useState<UploadResponse>();
    var classLabels = useproxy_AllOption();

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<RecommendApk>({
        // 初始化表单数据
        defaultValues: {
            id: RecommendEdit.id,
            img: RecommendEdit.img,
            packageName: RecommendEdit.packageName,
            appName: RecommendEdit.appName,
            sort: RecommendEdit.sort,
            classId: RecommendEdit.classId,
            className: RecommendEdit.className,
            lang: RecommendEdit.lang,
            distributorId: recommendFilter.distributorId,
            modelId: recommendFilter.modelId,
        },
    });

    // 提交表单
    const onSubmit = async (data: RecommendApk) => {
        console.log("data", data);
        if (apkRecommend) {
            data.img = apkRecommend.media_uri;
        }
        // 如果其中一个文件存在，则执行更新操作
        try {
            // 执行数据更新操作
            var response = await grpcRecommendEdit(data, authProxy.token);
            if (response.status) {
                message.success("success");
                goto(xstreamtableUrl[0]);
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
        goto(xstreamtableUrl[0]);
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
                <TextFieldElement name="packageName" label={t("包名")} required/>
                <TextFieldElement name="appName" label={t("name")} required/>
                <TextFieldElement
                    name="sort"
                    label={t("排序")}
                    type={"number"}
                    required
                />
                <SelectElement
                    label={t("类型")}
                    name="classId"
                    options={classLabels}
                    sx={{
                        minWidth: "180px",
                    }}
                    required={true}
                />
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"ApkRecommend"}
                        dir={"/apkRecommend/" + Date.now().toString() + "/"}
                        setRes={setApkRecommend}
                        file_type={null}
                    />
                </Stack>
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
