import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {initialTVBackgroundfilterParams, useproxy_TVBackgroundtableUrl} from "../store/store";
import {grpcBackgroundInsert} from "../api/grpcBackgroundInsert";
import {message} from "antd";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {IsOpenDialog} from "../../../../const/alert/store";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import Multyuploadfile from "../../../../const/uploadfile/multyuploadfile";

export const TVBackground_Add = () => {
    // 获取apktable地址信息
    var backgroundtableUrl = useproxy_TVBackgroundtableUrl();
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
    const [TVBackgroundImageRes, setTVBackgroundImageRes] =
        useState<UploadResponse[]>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<HomeBackgroundImage>({
        // 初始化表单数据
        defaultValues: initialTVBackgroundfilterParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (image: HomeBackgroundImage) => {
        setLoading(true);
        // 分销商型号判断
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商及型号");

            setLoading(false);
            return;
        }
        if (!TVBackgroundImageRes) {
            message.error("请上传图片");

            setLoading(false);
            return;
        }
        // image.distributorId = Distributorvalue
        // image.modelId = Modelvalue
        // 分销商型号判断
        // 上传文件判断
        console.log("TVBackgroundImageRes", TVBackgroundImageRes);
        // 上传文件判断
        try {
            var images = [];
            for (const item of TVBackgroundImageRes) {
                var homeTVBackgroundImage = new HomeBackgroundImage();
                homeTVBackgroundImage.distributorId = Distributorvalue;
                homeTVBackgroundImage.modelId = Modelvalue;
                homeTVBackgroundImage.url = item.media_uri;
                homeTVBackgroundImage.isUse = true;
                homeTVBackgroundImage.md5 = item.md5;
                homeTVBackgroundImage.filesize = item.file_size;
                images.push(homeTVBackgroundImage);
            }
            // 执行数据插入操作
            var res = await grpcBackgroundInsert(images, authProxy.token);
            if (res.status) {
                setLoading(false);
                IsOpenDialog.IsOpen = true;
                IsOpenDialog.title = "SUCCESS";
                IsOpenDialog.content = "插入数据成功";
                setTVBackgroundImageRes(null);
                handleResetForm();
                goto(backgroundtableUrl)
            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        setDistributorvalue(null);
        setTVBackgroundImageRes(null)
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
                <Stack direction={"row"} spacing={2}>
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Modelinput
                        Distributorvalue={Distributorvalue}
                        setModelvalue={setModelvalue}
                    />
                </Stack>
                <Stack
                    spacing={5}
                    direction={"row"}
                    alignItems={"flex-end"}
                    divider={<Divider orientation="vertical" flexItem/>}
                >
                    <Multyuploadfile
                        title={"电视背景图片"}
                        dir={"/backgroundImage/" + Date.now().toString() + "/"}
                        setRes={setTVBackgroundImageRes}
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
