import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {VodBanner} from "../../../../../api/ks/v1/km_pb";
import {useproxy_VodBannerEdit} from "../../store/vodbanner/store";
import {DebounceSelect} from "../../../../tvm/epg/component/epg_bindChannel";
import {iLikeSelectValue} from "../../../../../const/ilikeselect";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {fetchVodBannerlList} from "./Vodbanner_Add";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {grpcVodbannerEdit} from "../../api/vodbanner/grpcVodbannerEdit";

export const Vodbanner_Edit = () => {
    // 获取编辑变量
    var Vod = useproxy_VodBannerEdit();
    const {firstId} = useParams();
    // 获取Vodtable地址信息
    // 获取查看apk权限
    var permissions = authProxy.permissions;
    const VodtableUrl = permissions.find(
        (option) => option.name === "查看点播轮播图",
    );

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    const [selectValue, setSelectValue] = useState<iLikeSelectValue>({title: "", label: Vod.vodName, value: Vod.vid});
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();

    // 跳转路由
    const navigate = useNavigate();
    // 分销商值
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<VodBanner>({
        // 初始化表单数据
        defaultValues: {
            id: Vod.id,
            vid: Vod.vid,
            sort: Vod.sort,
            pic: Vod.pic,
            classId: Vod.classId,
            distributorId: Vod.distributorId,
            modelId: Vod.modelId,
            created: Vod.created,
            updated: Vod.updated,
            deleted: Vod.deleted,
            distributorName: Vod.distributorName,
            modelName: Vod.modelName,
            className: Vod.className,
            vodName: Vod.vodName,
            backdropPath: Vod.backdropPath,
        },
    });

    // 提交表单
    const onSubmit = async (data: VodBanner) => {
        if (apkIconRes) {
            data.pic = apkIconRes.media_uri
        }
        data.vid = selectValue?.value
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcVodbannerEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");
                goto(`${VodtableUrl?.url}/${VodtableUrl?.id}/${firstId}`);
            }
        } catch (error) {
            message.error("调用接口发生错误");
            setLoading(false);
            return;
        }
        setLoading(false);
    };
    // 重置表单值
    const handleResetForm = () => {
        setSelectValue({title: "", label: Vod.vodName, value: Vod.vid})
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(`${VodtableUrl?.url}/${VodtableUrl?.id}/${firstId}`);
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
                <LocationBar location={"编辑轮播图片"}/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <DebounceSelect
                    showSearch={true}
                    value={selectValue}
                    placeholder="请选择资源"
                    fetchOptions={(search) => fetchVodBannerlList(parseInt(firstId), search)} // 传递额外的值
                    onChange={(newValue) => {
                        console.log("newValue", newValue)
                        setSelectValue(newValue as iLikeSelectValue);
                    }}
                    size={"large"}
                    style={{width: "100%"}}
                />
                <Uploadfile
                    title={"轮播图片"}
                    dir={"/vod/bannerImg/" + Date.now().toString() + "/"}
                    setRes={setApkIconRes}
                    file_type={"ott"}
                />
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

