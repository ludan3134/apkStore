import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {
    useproxy_allCategories,
    useproxy_allPriceplans,
    useproxy_AppsEdit,
    useproxy_AppstableUrl,
} from "../../store/app/store";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {grpcAppsEdit} from "../../api/app/grpcAppEdit";
import Multyuploadfile from "../../../../../const/uploadfile/multyuploadfile";
import {validateRating} from "../../../../../const/uploadfile/valdateRating";
import {IsWSTOption} from "../../../../../const/option";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";

export const Apps_Edit = () => {
    // 获取编辑变量
    var Apps = useproxy_AppsEdit();
    console.log("Apps", Apps);
    // 获取Appstable地址信息
    var AppstableUrl = useproxy_AppstableUrl();
    var allCategories = useproxy_allCategories();

    // 请求是否成功
    var allPriceplans = useproxy_allPriceplans();
    const [loading, setLoading] = useState(false);
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        Apps.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>(Apps.modelId);
    // 分销商值
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 上传返回数据
    const [AppsIconRes, setAppsIconRes] = useState<UploadResponse>();
    const [AppCarousel, setAppCarousel] = useState<UploadResponse>();
    const [AppBannerImages, setAppBannerImages] = useState<UploadResponse[]>();
    const [Catpromo, setCatpromo] = useState<UploadResponse>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apps>({
        // 初始化表单数据
        defaultValues: {
            id: Apps.id,
            appName: Apps.appName,
            appDescription: Apps.appDescription,
            appIcon: Apps.appIcon,
            appCarousel: Apps.appCarousel,
            appSort: Apps.appSort,
            appBanner: Apps.appBanner,
            systemRequirement: Apps.systemRequirement,
            rating: Apps.rating,
            categoriesIds: Apps.categoriesIds,
            categoriesName: Apps.categoriesName,
            pricePlansIds: Apps.pricePlansIds,
            pricePlansName: Apps.pricePlansName,
            class: Apps.class,
            copyrightNotice: Apps.copyrightNotice,
            isShowToolTip: Apps.isShowToolTip,
            isShowOnMarket: Apps.isShowOnMarket,
            modelId: Apps.modelId,
            distributorId: Apps.distributorId,
            catPromo: Apps.catPromo,
            categoriesId: Apps.categoriesId,
        },
    });

    // 提交表单
    const onSubmit = async (Apps: Apps) => {
        console.log("Distributorvalue", Distributorvalue);
        console.log("Modelvalue", Modelvalue);
        Apps.distributorId = Distributorvalue;
        Apps.modelId = Modelvalue;
        setLoading(true);
        console.log("AppsIconRes", AppsIconRes);
        console.log("AppCarousel", AppCarousel);
        console.log("AppBannerImages", AppBannerImages);
        if (AppsIconRes) {
            Apps.appIcon = AppsIconRes.media_uri;
        }

        // 检查 AppCarousel 是否存在，如果存在则更新 Apps 的 appCarousel
        if (AppCarousel) {
            Apps.appCarousel = AppCarousel.media_uri;
        }
        if (Catpromo) {
            Apps.catPromo = Catpromo.media_uri;
        }
        // 检查 AppBannerImages 是否存在，如果存在则更新 Apps 的 appBanner
        if (AppBannerImages) {
            Apps.appBanner = AppBannerImages.map((item) => item.media_uri);
        }
        // 执行数据更新操作

        var response = await grpcAppsEdit(Apps, authProxy.token);
        if (response.status) {
            message.success("更新成功!");
            goto(AppstableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(AppstableUrl);
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
                <LocationBar location={"编辑Apps"}/>
                <TextFieldElement name="appName" label="app名称" required/>
                <TextFieldElement name="appDescription" label="描述" required/>
                <TextFieldElement name="systemRequirement" label="系统要求" required/>
                <TextFieldElement name="appSort" label="排序"/>
                <TextFieldElement
                    name="categoriesId"
                    label="桌面排序Id"
                    type={"number"}
                    required
                />

                <TextFieldElement
                    name="rating"
                    label="评分(1-5)"
                    type={"number"}
                    validation={{validate: validateRating}}
                />
                <TextFieldElement name="class" label="包名"/>
                <TextFieldElement name="copyrightNotice" label="版权信息"/>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
                {/*<SelectElement*/}
                {/*    label="菜单分类"*/}
                {/*    name="categoriesId"*/}
                {/*    options={allCategories}*/}
                {/*/>*/}
                {/*<SelectElement*/}
                {/*    label="价格套餐"*/}
                {/*    name="pricePlansId"*/}
                {/*    options={allPriceplans}*/}
                {/*/>*/}
                <MultiSelectElement
                    itemKey="id"
                    itemLabel="label"
                    label="菜单分类"
                    name="categoriesIds"
                    options={allCategories}
                    showChips={true}
                    required={true}
                />
                <MultiSelectElement
                    itemKey="id"
                    itemLabel="label"
                    label="价格套餐"
                    name="pricePlansIds"
                    options={allPriceplans}
                    showChips={true}
                    required={true}
                />
                <SelectElement
                    size={"medium"}
                    label="市场展示"
                    name="isShowOnMarket"
                    defaultValue={Apps.isShowOnMarket}
                    options={IsWSTOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否弹窗"
                    name="isShowToolTip"
                    defaultValue={Apps.isShowToolTip}
                    options={IsWSTOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Uploadfile
                        title={"更新应用图标"}
                        dir={"/Apps/AppsIcon/" + Date.now().toString() + "/"}
                        setRes={setAppsIconRes}
                        file_type={null}
                    />
                    <Uploadfile
                        title={"更新应用轮播图"}
                        dir={"/Apps/AppsCarousel/" + Date.now().toString() + "/"}
                        setRes={setAppCarousel}
                        file_type={null}
                    />
                    <Uploadfile
                        title={"分类宣传图"}
                        dir={"/Apps/catPromo/" + Date.now().toString() + "/"}
                        setRes={setCatpromo}
                        file_type={null}
                    />
                    <Multyuploadfile
                        title={"更新应用横幅"}
                        dir={"/AppBanner/" + Date.now().toString() + "/"}
                        setRes={setAppBannerImages}
                        file_type={null}
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
