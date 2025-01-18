import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {useNavigate, useParams} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {message} from "antd";
import {authProxy} from "../../../../auth/store/store";
import CircularIndeterminate from "../../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../../const/locationbar";
import {IsBoolOption, TvmrebroadcastUseFlagOption,} from "../../../../../const/option";
import {Channel} from "../../../../../api/ks/v1/km_pb";
import {useproxy_ThirdCalssEdit} from "../../store/third/store";
import {grpcThirdEdit} from "../../api/third/grpcThirdEdit";
import {UploadResponse} from "../../../../../const/uploadfile/model";

export const Third_Edit = () => {
    // 获取编辑变量
    var thirdclass = useproxy_ThirdCalssEdit();
    // 获取thirdclasstable地址信息
    const {menuId, id, mid, fid} = useParams();

    var permissions = authProxy.permissions;
    const ThirdTable = permissions.find(
        (option) => option.name === "查看三级分类",
    );

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 上传返回数据
    const [imageRes, setImageRes] = useState<UploadResponse>();
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    // 分销商值
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Channel>({
        // 初始化表单数据
        defaultValues: {
            name: thirdclass.name,
            id: thirdclass.id,
            subClassId: thirdclass.subClassId,
            zhName: thirdclass.zhName,
            keyword: thirdclass.keyword,
            sort: thirdclass.sort,
            isUse: thirdclass.isUse,
            channelNumber: thirdclass.channelNumber,
            image: thirdclass.image,
            aliasName: thirdclass.aliasName,
            isAdult: thirdclass.isAdult,
            rebroadcastUseFlag: thirdclass.rebroadcastUseFlag,
            shiftingUseFlag: thirdclass.shiftingUseFlag,
            mainClassId: thirdclass.mainClassId,
            isRecommend: thirdclass.isRecommend,
            streamId: thirdclass.streamId,

            recommendSort: thirdclass.recommendSort,
            playbackName: thirdclass.playbackName,
            maxBuffer: thirdclass.maxBuffer,
            mpegtsCache: thirdclass.mpegtsCache,
            pullOnStart: thirdclass.pullOnStart,
        },
    });

    // 提交表单
    const onSubmit = async (data: Channel) => {
        console.log("data", data);
        setLoading(true);
        data.image = imageRes?.media_uri || thirdclass.image;
        try {
            // 执行数据更新操作
            var response = await grpcThirdEdit(data, authProxy.token);
            if (response.status) {
                message.success("更新成功");

                goto(`${ThirdTable?.url}/${ThirdTable?.id}/${fid}/${mid}`);
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
        formContext.reset();
    };

    // 返回上一级
    const handleReturn = () => {
        goto(`${ThirdTable?.url}/${ThirdTable?.id}/${fid}/${mid}`);
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
                <LocationBar location={"编辑频道"}/>
                <TextFieldElement name="name" label="名称"/>
                <TextFieldElement name="zhName" label="中文名称"/>
                <TextFieldElement name="keyword" label="关键字"/>
                <TextFieldElement name="sort" label="排序" type={"number"}/>
                <TextFieldElement name="streamId" label="streamId" type={"number"}/>
                <TextFieldElement name="aliasName" label="别名"/>
                <TextFieldElement
                    name="recommendSort"
                    label="recommendSort"
                    type={"number"}
                />
                <TextFieldElement name="playbackName" label="playbackName"/>
                <TextFieldElement name="maxBuffer" label="maxBuffer" type={"number"}/>
                <TextFieldElement name="mpegtsCache" label="mpegtsCache"/>
                <TextFieldElement name="pullOnStart" label="pullOnStart"/>
                <SelectElement
                    size={"medium"}
                    label="是否可用"
                    name="isUse"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否推荐"
                    name="isRecommend"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="是否加密"
                    name="isAdult"
                    options={IsBoolOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    size={"medium"}
                    label="重播标志"
                    name="rebroadcastUseFlag"
                    options={TvmrebroadcastUseFlagOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                {/*<Uploadfile title={"频道图片"} dir={"/channel/" + Date.now().toString() + "/"}*/}
                {/*            setRes={setImageRes} file_type={null}/>*/}
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
