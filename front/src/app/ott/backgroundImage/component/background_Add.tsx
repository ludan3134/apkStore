import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {grpcBackgroundInsert} from "../api/grpcBackgroundInsert";
import {initialBackgroundfilterParams, useproxy_BackgroundtableUrl} from "../store/store";

import {message} from "antd";
import {UploadResponse} from "../../../../const/uploadfile/model";
import {HomeBackgroundImage} from "../../../../api/fs/v1/fm_pb";
import {authProxy} from "../../../auth/store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Multyuploadfile from "../../../../const/uploadfile/multyuploadfile";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";

export const Background_Add = () => {
    // 获取apktable地址信息
    var addtableUrl = useproxy_BackgroundtableUrl();
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
    const [backgroundImageRes, setBackgroundImageRes] =
        useState<UploadResponse[]>();
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<HomeBackgroundImage>({
        // 初始化表单数据
        defaultValues: initialBackgroundfilterParams,
    });
    // 表单提交时的回调函数
    const onSubmit = async (image: HomeBackgroundImage) => {
        setLoading(true);
        // 分销商型号判断
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商和型号!");

            setLoading(false);
            return;
        }
        // image.distributorId = Distributorvalue
        // image.modelId = Modelvalue
        // 分销商型号判断
        // 上传文件判断
        if (!backgroundImageRes) {
            message.error("请上传背景图片");

            setLoading(false);
            return;
        }
        console.log("backgroundImageRes", backgroundImageRes);
        // 上传文件判断
        try {
            var images = [];
            for (const item of backgroundImageRes) {
                var homeBackgroundImage = new HomeBackgroundImage();
                homeBackgroundImage.distributorId = Distributorvalue;
                homeBackgroundImage.modelId = Modelvalue;
                homeBackgroundImage.url = item.media_uri;
                homeBackgroundImage.isUse = true;
                homeBackgroundImage.md5 = item.md5;
                homeBackgroundImage.filesize = item.file_size;
                images.push(homeBackgroundImage);
            }
            // 执行数据插入操作
            var res = await grpcBackgroundInsert(images, authProxy.token);
            if (res.status) {
                setLoading(false);
                message.success("数据插入成功");
                handleResetForm();
                goto(addtableUrl);

            }
        } catch (error) {
            message.error("调用接口发生错误");
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        setDistributorvalue(null);
        setBackgroundImageRes(null)
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
                        title={"背景图片"}
                        dir={"/backgroundImage/" + Date.now().toString() + "/"}
                        setRes={setBackgroundImageRes}
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
