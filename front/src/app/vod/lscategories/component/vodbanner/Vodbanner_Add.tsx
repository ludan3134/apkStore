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
import {LabelResp, VodBanner} from "../../../../../api/ks/v1/km_pb";
import {DebounceSelect} from "../../../../tvm/epg/component/epg_bindChannel";
import {iLikeSelectValue} from "../../../../../const/ilikeselect";
import Uploadfile from "../../../../../const/uploadfile/uploadfile";
import {UploadResponse} from "../../../../../const/uploadfile/model";
import {grpcAllVod} from "../../api/vodbanner/grpcAllVod";
import {grpcVodbannerInsert} from "../../api/vodbanner/grpcVodbannerInsert";


export async function fetchVodBannerlList(
    firstId: number,
    name: string,
): Promise<iLikeSelectValue[]> {
    try {
        var res = await grpcAllVod(firstId, name);
        // 确保 res.priceLabelList 是 AllPricePlanLabel 类型的数组
        return res.vodList.map((item: LabelResp) => ({
            label: item.label,
            value: item.id,
        }));
    } catch (error) {
        console.error("Fetching channel list failed:", error);
        return [];
    }
}

export const Vodbanner_Add = () => {
    var permissions = authProxy.permissions;
    const VodtableUrl = permissions.find(
        (option) => option.name === "查看点播轮播图",
    );
    const {firstId} = useParams();
    const [selectValue, setSelectValue] = useState<iLikeSelectValue>();
    const [apkIconRes, setApkIconRes] = useState<UploadResponse>();

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<VodBanner>({
        // 初始化表单数据
        defaultValues: {},
    });

    // 提交表单
    const onSubmit = async (data: VodBanner) => {
        setLoading(true);
        data.classId = parseInt(firstId)
        if (!selectValue?.value) {
            message.error("请选中资源Id");
            setLoading(false);
            return;
        }
        data.vid = selectValue.value
        data.pic = apkIconRes?.media_uri
        try {
            // 执行数据更新操作
            var response = await grpcVodbannerInsert(data, authProxy.token);
            if (response.status) {
                message.success("添加成功");
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
        setSelectValue(null)
        setApkIconRes(null)
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
                <LocationBar location={"新增轮播图片"}/>
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
