import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";

import {TVApkStarOptions, useproxy_TVApkEdit, useproxy_TVApktableUrl,} from "../../store/apk/store";
import {grpcTVApkEdit} from "../../api/apk/grpcTVApkEdit";
import {message} from "antd";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {Apk} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import {IsUploadFileReset} from "../../../../../const/uploadfile/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import DialogActions from "@mui/material/DialogActions";

export const TVApk_Edit = () => {
    // 获取编辑变量
    var TVApk = useproxy_TVApkEdit();
    // 获取TVApktable地址信息
    var TVApktableUrl = useproxy_TVApktableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 上传返回数据
    const [TVApkIconRes, setTVApkIconRes] = useState<UploadResponse>();
    const [TVApkScriRes, setTVApkScriRes] = useState<UploadResponse>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apk>({
        // 初始化表单数据
        defaultValues: {
            id: TVApk.id,
            name: TVApk.name,
            type: TVApk.type,
            class: TVApk.class,
            sort: TVApk.sort,
            distributorId: TVApk.distributorId,
            modelId: TVApk.modelId,
            isShowBanner: TVApk.isShowBanner,
            isShowOnMarket: TVApk.isShowOnMarket,
            star: TVApk.star,
            downloadCount: TVApk.downloadCount,
            img: TVApk.img,
            bannerImg: TVApk.bannerImg,
            deleted: TVApk.deleted,
            isWhite: TVApk.isWhite,
            isShowToolTip: TVApk.isShowToolTip,
            apkContent: TVApk.apkContent
        },
    });
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>(
        TVApk.distributorId,
    );
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    // 提交表单
    const onSubmit = async (TVApk: Apk) => {
        setLoading(true);
        // 分销商型号判断
        TVApk.distributorId = Distributorvalue || TVApk.distributorId;
        TVApk.modelId = Modelvalue || TVApk.modelId;
        // 分销商型号判断
        // 上传文件判断
        TVApk.img = TVApkIconRes?.media_uri || TVApk.img;
        TVApk.bannerImg = TVApkScriRes?.media_uri || TVApk.bannerImg;
        // 上传文件判断

        // 执行数据更新操作
        var response = await grpcTVApkEdit(TVApk, authProxy.token);
        if (response.status) {
            message.success("更新成功");

            goto(TVApktableUrl);
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        setDistributorvalue(TVApk.distributorId);
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(TVApktableUrl);
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
                <LocationBar location={"编辑TVApk"}/>
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
                        label="星级评定"
                        name="star"
                        options={TVApkStarOptions}
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
                        title={"更新ApkIcon"}
                        dir={"/apk/apkIcon/" + Date.now().toString() + "/"}
                        setRes={setTVApkIconRes}
                        file_type={"tv"}
                    />
                    <Uploadfile
                        title={"更新ApkScri"}
                        dir={"/apk/apkScri/" + Date.now().toString() + "/"}
                        setRes={setTVApkScriRes}
                        file_type={"tv"}
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
