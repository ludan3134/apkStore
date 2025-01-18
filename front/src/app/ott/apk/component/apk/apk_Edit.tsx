import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import {grpcApkEdit} from "../../api/apk/grpcApkEdit";
import {apkStarOptions, useproxy_ApkEdit, useproxy_ApktableUrl,} from "../../store/apk/store";
import DialogActions from "@mui/material/DialogActions";
import {message, UploadFile} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {Apk, ApkCategory} from "../../../../../api/fs/v1/fm_pb";
import Distributor2Model from "../../../../../const/distributortomodel/component/distributor2model";
import {
    DistributorInputStoreProxy,
    useproxy_DistributorValue,
    useproxy_ModelValue,
} from "../../../../../const/distributortomodel/store/store";
import {IsConfirmDialog} from "../../../../../const/alert/store";
import {ApkCategoryLabel} from "../../../../../api/fs/v1/fs_pb";
import {grpcAllCategories} from "../../../categories/api/grpcAllCategories";
import BulkUploadImage, {convertToUploadFile} from "../../../../../const/uploadfile/BulkUploadImage";

export const Apk_Edit = () => {
    // 获取编辑变量
    var Apk = useproxy_ApkEdit();
    // 获取apktable地址信息
    var apktableUrl = useproxy_ApktableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    const initialApkImage = Apk && Apk.apkImg ? Apk.apkImg.map((imageUrl, index) => convertToUploadFile(imageUrl, index)) : [];
    console.log("initialApkImage", initialApkImage)
    // 上传返回数据
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();
    const [apkScriRes, setApkScriRes] = useState<UploadResponse>();
    const [fileList, setFileList] = useState<UploadFile[]>(initialApkImage);
    // 使用 useForm 声明一个 formContext
    const distributorValue = useproxy_DistributorValue();
    const modelValue = useproxy_ModelValue();
    // 父亲
    const [parent, setParent] = useState<ApkCategoryLabel[]>()
    // 儿子
    const [son, setSon] = useState<ApkCategoryLabel[]>()

    // 表单提交时的回调函数
    const formContext = useForm<Apk>({
        // 初始化表单数据
        defaultValues: {
            id: Apk.id,
            name: Apk.name,
            type: Apk.type,
            class: Apk.class,
            sort: Apk.sort,
            distributorId: Apk.distributorId,
            modelId: Apk.modelId,
            isShowBanner: Apk.isShowBanner,
            isShowOnMarket: Apk.isShowOnMarket,
            star: Apk.star,
            downloadCount: Apk.downloadCount,
            img: Apk.img,
            bannerImg: Apk.bannerImg,
            deleted: Apk.deleted,
            isWhite: Apk.isWhite,
            isShowToolTip: Apk.isShowToolTip,
            categoryId: Apk.categoryId,
            categoryName: Apk.categoryName,
            parentCategory: Apk.parentCategory,
            apkImg: Apk.apkImg,
            apkContent: Apk.apkContent,
            copyright: Apk.copyright,
            systemContent: Apk.systemContent
        },
    });
    useEffect(() => {
        const fetchParent = async () => {
            try {
                var apkCategory = new ApkCategory();
                apkCategory.parentId = "0"
                // 调用grpcAllCategories函数获取数据
                const res = await grpcAllCategories(authProxy.token, apkCategory);
                // 使用setParent更新状态
                setParent(res.apkCategoryLabel);
            } catch (error) {
                // 处理错误情况
                console.error("Failed to fetch parent category:", error);
                // 可能需要设置错误状态或显示错误消息
            }
        };

        // 调用fetchParent函数
        fetchParent();
    }, []); // 空依赖数组表示这个effect只在组件挂载时运行一次
    useEffect(() => {
        const fetchParent = async () => {
            try {
                var watchParentCategory = formContext.watch("parentCategory");
                var apkCategory = new ApkCategory();
                apkCategory.parentId = watchParentCategory
                // 调用grpcAllCategories函数获取数据
                const res = await grpcAllCategories(authProxy.token, apkCategory);
                // 使用setParent更新状态
                setSon(res.apkCategoryLabel);
            } catch (error) {
                // 处理错误情况
                console.error("Failed to fetch parent category:", error);
                // 可能需要设置错误状态或显示错误消息
            }
        };

        // 调用fetchParent函数
        fetchParent();
    }, [formContext.watch("parentCategory")]); // 空依赖数组表示这个effect只在组件挂载时运行一次
    // 提交表单
    const onSubmit = async (apk: Apk) => {
        let apkImage: string[] = [];
        console.log("AAAfilelist", fileList)
        // 使用 map 方法遍历 fileList 并收集 media_uri
        fileList.forEach((file, index) => { // 使用 forEach 而不是 map，因为我们不需要返回一个新数组
            console.log(`文件 ${index}:`, file);
            // 确保 file.response 和 file.response.media_uri 存在
            if (file.response && file.response.media_uri) {
                // 将 media_uri 添加到 apkImage 数组中
                apkImage.push(file.response.media_uri);
            }
        });
        apk.apkImg = apkImage.length > 0 ? apkImage : Apk.apkImg;
        setLoading(true);
        // 分销商型号判断
        if (modelValue == "0" || !distributorValue || !modelValue) {
            message.error("分销商型号不能为空/0)");
            return;
        }
        apk.distributorId = distributorValue;
        apk.modelId = modelValue;
        // 分销商型号判断
        // 上传文件判断
        apk.img = apkIconRes?.media_uri || Apk.img;
        apk.bannerImg = apkScriRes?.media_uri || Apk.bannerImg;

        var response = await grpcApkEdit(apk, authProxy.token);
        if (response.status) {
            message.success(response.message);
            goto(apktableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        DistributorInputStoreProxy.DistributorValue = Apk.distributorId;
        DistributorInputStoreProxy.ModelValue = Apk.modelId;
        IsConfirmDialog.refleshPage = true;
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(apktableUrl);
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
                <LocationBar location={"编辑apk"}/>
                <TextFieldElement name="name" label="名称" required/>
                <TextFieldElement name="type" label="类型" required/>
                <TextFieldElement name="class" label="包名" required/>
                <TextFieldElement name="systemContent" label="系统需求"/>
                <TextFieldElement name="copyright" label="版权信息"/>
                <TextFieldElement
                    name="downloadCount"
                    label="下载次数"
                    type={"number"}
                />
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <TextFieldElement
                    name="apkContent"
                    label="描述"
                />
                <Distributor2Model/>

                <Stack direction={"row"} spacing={2}>
                    <SelectElement
                        size={"medium"}
                        label="主菜单"
                        name="parentCategory"
                        options={parent}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="子菜单"
                        name="categoryId"
                        options={son}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="星级评定"
                        name="star"
                        options={apkStarOptions}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="是否推送市场"
                        name="isShowOnMarket"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="是否显示滚动横幅"
                        name="isShowBanner"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />

                    <SelectElement
                        size={"medium"}
                        label="是否弹框提示"
                        name="isShowToolTip"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "275px",
                        }}
                    />
                    <SelectElement
                        size={"medium"}
                        label="是否白名单"
                        name="isWhite"
                        options={IsBoolOption}
                        sx={{
                            minWidth: "200px",
                        }}
                    />
                </Stack>
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"apk图标"}
                        dir={"/apk/apkIcon/" + Date.now().toString() + "/"}
                        setRes={setApkIconRes}
                        file_type={null}
                    />
                    <Uploadfile
                        title={"apk广告图片"}
                        dir={"/apk/apkScri/" + Date.now().toString() + "/"}
                        setRes={setApkScriRes}
                        file_type={null}
                    />
                    {/*<UploadFileList*/}
                    {/*    title={"上传ApKImage"}*/}
                    {/*    dir={"/apk/apkImage/" + Date.now().toString() + "/"}*/}
                    {/*    setRes={setApkImage}*/}
                    {/*    file_type={"ott"}*/}
                    {/*/>*/}
                    <BulkUploadImage
                        title={"apk功能截图"}
                        dir={"/apk/apkImage/" + Date.now().toString() + "/"}
                        setRes={setFileList}
                        ApkImage={initialApkImage}
                        file_type={"ott"}
                    />
                </Stack>
            </Stack>
            <DialogActions>
                <Button variant="contained" size="large" onClick={() => handleReturn()}>
                    返回上一级
                </Button>
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
