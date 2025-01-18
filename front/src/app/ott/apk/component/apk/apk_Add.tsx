import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";

import {useNavigate} from "react-router-dom";
import {apkStarOptions, initialApkParams, useproxy_ApktableUrl,} from "../../store/apk/store";
import {grpcApkInsert} from "../../api/apk/grpcApkInsert";
import DialogActions from "@mui/material/DialogActions";

import {message, UploadFile} from "antd";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {Apk, ApkCategory} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {ApkCategoryLabel} from "../../../../../api/fs/v1/fs_pb";
import {grpcAllCategories} from "../../../categories/api/grpcAllCategories";
import BulkUploadImage from "../../../../../const/uploadfile/BulkUploadImage";

export const Apk_Add = () => {
    // 获取apktable地址信息
    var apktableUrl = useproxy_ApktableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    // 上传返回数据
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();
    const [apkScriRes, setApkScriRes] = useState<UploadResponse>();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apk>({
        // 初始化表单数据
        defaultValues: initialApkParams,
    });
    // 父亲
    const [parent, setParent] = useState<ApkCategoryLabel[]>()
    // 儿子
    const [son, setSon] = useState<ApkCategoryLabel[]>()
    // 表单提交时的回调函数
    const onSubmit = async (apk: Apk) => {
        setLoading(true);
        console.log(Distributorvalue + "/" + Modelvalue);
        // 分销商型号判断
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商型号");
            setLoading(false);
            return;
        }
        apk.distributorId = Distributorvalue
        apk.modelId = Modelvalue
        // if (fileList.length == 0) {
        //     message.error("请至少上传一张apkImage");
        //     setLoading(false);
        //     return;
        // }
        let apkImage: string[] = [];
        // 使用 map 方法遍历 fileList 并收集 media_uri
        fileList.forEach((file, index) => { // 使用 forEach 而不是 map，因为我们不需要返回一个新数组
            console.log(`文件 ${index}:`, file);
            // 确保 file.response 和 file.response.media_uri 存在
            if (file.response && file.response.media_uri) {
                // 将 media_uri 添加到 apkImage 数组中
                apkImage.push(file.response.media_uri);
            }
        });
        apk.apkImg = apkImage
        // 分销商型号判断
        // 上传文件判断
        if (!apkIconRes || !apkScriRes) {
            message.error("请选中apklogo和滚动图片");
            setLoading(false);
            return;
        }
        apk.img = apkIconRes.media_uri;
        apk.bannerImg = apkScriRes.media_uri;
        // 上传文件判断
        try {
            // 执行数据插入操作
            var res = await grpcApkInsert(apk, authProxy.token);
            if (res.status) {
                goto(apktableUrl);
                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        message.info(res.message)
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        setDistributorvalue(null);
        formContext.reset(); // 重置表单值
    };
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
    }, [formContext.watch("parentCategory")]);
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
                <LocationBar location={"新增apk"}/>
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
                <TextFieldElement
                    name="apkContent"
                    label="描述"
                />
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
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
                        file_type={"ott"}
                    />
                    <Uploadfile
                        title={"apk广告图片"}
                        dir={"/apk/apkScri/" + Date.now().toString() + "/"}
                        setRes={setApkScriRes}
                        file_type={"ott"}
                    />
                    <BulkUploadImage
                        title={"apk功能截图"}
                        dir={"/apk/apkImage/" + Date.now().toString() + "/"}
                        setRes={setFileList}
                        ApkImage={[]}
                        file_type={"ott"}
                    />
                </Stack>
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

