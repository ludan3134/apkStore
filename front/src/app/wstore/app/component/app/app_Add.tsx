import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, MultiSelectElement, SelectElement, TextFieldElement,} from "react-hook-form-mui";

import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {
    initialAppsParams,
    useproxy_allCategories,
    useproxy_allPriceplans,
    useproxy_AppstableUrl,
} from "../../store/app/store";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {grpcAppsInsert} from "../../api/app/grpcAppInsert";
import Multyuploadfile from "../../../../../const/uploadfile/multyuploadfile";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {validateRating} from "../../../../../const/uploadfile/valdateRating";
import {IsWSTOption} from "../../../../../const/option";

// const validateRating = (value: number): => {
//     if (value < 1 || value > 5) {
//         return Promise.reject(new Error("Rating must be a number between 1 and 5."));
//     }
//     return Promise.resolve(); // 这里返回 void 也是合法的，因为 void 是 ValidateResult 的一部分
// };

export const Apps_Add = () => {
    // 获取Appstable地址信息
    var AppstableUrl = useproxy_AppstableUrl();
    var allCategories = useproxy_allCategories();
    var allPriceplans = useproxy_allPriceplans();

    console.log("all", allCategories, allPriceplans);
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
    const [AppsIconRes, setAppsIconRes] = useState<UploadResponse>();
    const [AppCarousel, setAppCarousel] = useState<UploadResponse>();
    const [AppBannerImages, setAppBannerImages] = useState<UploadResponse[]>();
    const [Catpromo, setCatpromo] = useState<UploadResponse>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apps>({
        // 初始化表单数据
        defaultValues: initialAppsParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (Apps: Apps) => {
        setLoading(true);
        // 分销商型号判断
        console.log("AppsIconRes", AppsIconRes);
        console.log("AppCarousel", AppCarousel);
        console.log("AppBannerImages", AppBannerImages);
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商型号");
            setLoading(false);
            return;
        }
        Apps.distributorId = Distributorvalue;
        Apps.modelId = Modelvalue;
        // 上传文件判断
        if (!AppsIconRes || !AppCarousel || !AppBannerImages || !Catpromo) {
            message.error("请选中AppsIcon/AppCarousel/AppBannerImages");
            setLoading(false);
            return;
        }
        Apps.appIcon = AppsIconRes.media_uri;
        Apps.appCarousel = AppCarousel.media_uri;
        Apps.catPromo = Catpromo.media_uri;
        Apps.deleted = false;
        // 上传文件判断

        try {
            // 执行数据插入操作
            for (const item of AppBannerImages) {
                Apps.appBanner.push(item.media_uri);
            }
            var res = await grpcAppsInsert(Apps, authProxy.token);
            if (res.status) {
                goto(AppstableUrl);
                return true; // 添加返回 true 停止循环
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        setDistributorvalue(null);
        formContext.reset(); // 重置表单值
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                onSubmit(data);
            }}
            mode={"all"}
        >
            {loading && <CircularIndeterminate/>}
            {/* 使用 TextFieldElement 渲染表单组件 */}
            <Stack spacing={2}>
                <LocationBar location={"新增Apps"}/>
                <TextFieldElement name="appName" label="app名称"/>
                <TextFieldElement name="appDescription" label="描述" required/>
                <TextFieldElement name="systemRequirement" label="系统要求" required/>
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
                    defaultValue={1}
                />
                <TextFieldElement
                    name="app_sort"
                    label="排序"
                    type={"number"}
                    required={true}
                    defaultValue={1}
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
                {/*<SelectElement*/}
                {/*    label="价格套餐"*/}
                {/*    name="pricePlansId"*/}
                {/*    options={allPriceplans}*/}
                {/*/>*/}
                <SelectElement
                    size={"medium"}
                    label="市场展示"
                    name="isShowOnMarket"
                    options={IsWSTOption}
                    sx={{
                        minWidth: "275px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否弹窗"
                    name="isShowToolTip"
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
                        title={"AppsIcon"}
                        dir={"/Apps/AppsIcon/" + Date.now().toString() + "/"}
                        setRes={setAppsIconRes}
                        file_type={null}
                    />
                    <Uploadfile
                        title={"AppsCarousel"}
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
                        title={"AppBanner"}
                        dir={"/AppBanner/" + Date.now().toString() + "/"}
                        setRes={setAppBannerImages}
                        file_type={null}
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
