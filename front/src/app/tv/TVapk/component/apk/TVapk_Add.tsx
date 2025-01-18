import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";

import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {initialTVApkParams, TVApkStarOptions, useproxy_TVApktableUrl,} from "../../store/apk/store";
import {grpcApkInsert} from "../../api/apk/grpcApkInsert";
import {message} from "antd";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {Apk} from "../../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {IsBoolOption} from "../../../../../const/option";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";

export const TVApk_Add = () => {
    // 获取TVApktable地址信息
    var TVApktableUrl = useproxy_TVApktableUrl();
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
    const [TVApkIconRes, setTVApkIconRes] = useState<UploadResponse>();
    const [TVApkScriRes, setTVApkScriRes] = useState<UploadResponse>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apk>({
        // 初始化表单数据
        defaultValues: initialTVApkParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (TVApk: Apk) => {
        setLoading(true);
        console.log(Distributorvalue + "/" + Modelvalue);
        // 分销商型号判断
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商及型号");

            setLoading(false);
            return;
        }
        TVApk.distributorId = Distributorvalue;
        TVApk.modelId = Modelvalue;
        // 分销商型号判断
        console.log("TVApkIconRes", TVApkIconRes);
        console.log("TVApkScriRes", TVApkScriRes);
        // 上传文件判断
        if (!TVApkIconRes || !TVApkScriRes) {
            message.error("请上传TVApk图标和截图图片");
            setLoading(false);
            return;
        }
        TVApk.img = TVApkIconRes.media_uri;
        TVApk.bannerImg = TVApkScriRes.media_uri;
        // 上传文件判断

        try {
            // 执行数据插入操作
            var res = await grpcApkInsert(TVApk, authProxy.token);
            if (res.status) {
                message.success("添加成功");
                goto(TVApktableUrl);
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
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}
            <Stack spacing={2}>
                <LocationBar location={"新增TVApk"}/>
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
                        setRes={setTVApkIconRes}
                        file_type={"tv"}
                    />
                    <Uploadfile
                        title={"apk广告图片"}
                        dir={"/apk/apkScri/" + Date.now().toString() + "/"}
                        setRes={setTVApkScriRes}
                        file_type={"tv"}
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
