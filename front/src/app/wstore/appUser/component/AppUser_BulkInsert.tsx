import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, IconButton, ImageListItem, ImageListItemBar, Stack,} from "@mui/material";
import {FormContainer, SelectElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";

import {message} from "antd";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {AppUserfunOption} from "../../../../const/option";
import Uploadfile2parent from "../../../../const/uploadfile/uploadfile2parent";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {useproxy_AppUsertableUrl} from "../store/store";
import {AppUserBulkImport} from "../store/model";
import envUrls from "../../../../const/baseurl";

export function InfoIcon() {
    return null;
}

export const AppUser_BulkInsert = () => {
    // 获取accounttable地址信息
    var appUsertableUrl = useproxy_AppUsertableUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    // 文件传递
    const [AppUserFile, setTerminalFile] = useState<File>();
    // 请求是否成功
    const handleAppUserFileUpload = (file: File) => {
        setTerminalFile(file);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AppUserBulkImport>({
        // 初始化表单数据
        defaultValues: {
            distributor_id: "",
            model_id: "",
            fun: "",
        },
    });

    // 提交表单
    const onSubmit = async (data: AppUserBulkImport, file: File) => {
        if (Distributorvalue == null || Modelvalue == null) {
            message.error("请选中分销商型号");
            setLoading(false);
            return;
        }
        data.distributor_id = Distributorvalue;
        data.model_id = Modelvalue;
        if (!AppUserFile) {
            message.error("请上传批量导入文件");
            return;
        }
        setLoading(true);
        // 如果其中一个文件存在，则执行新增操作
        try {
            const formData = new FormData();
            formData.append("importAppUser", file);
            formData.append("distributor_id", data.distributor_id);
            formData.append("model_id", data.model_id);
            formData.append("fun", String(data.fun));

            const response = await fetch(envUrls.BulkImportWSTBaseUrl, {
                method: "POST",
                body: formData,
                mode: "cors",
            });
            console.log("response", response);
            if (response.status) {
                // message.success("添加成功")
                message.success("导入成功1");
                console.log("res", response);
                goto(appUsertableUrl);
            }
            // 执行数据新增操作
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
        goto(appUsertableUrl);
    };
    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                onSubmit(data, AppUserFile);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}

            <Stack spacing={2}>
                <LocationBar location={"批量导入App用户终端"}/>
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
                        label="设置处理类型"
                        name="fun"
                        options={AppUserfunOption}
                        sx={{
                            minWidth: "150px",
                        }}
                    />
                </Stack>
                <Stack style={{width: "558px", height: "296px"}}>
                    <ImageListItem>
                        <img
                            // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`http://upd.rja3.xyz/images/Apps/6037D13C-F3E9-4c1a-A08B-4535661AED9D.png?w=50&h=50&fit=crop&auto=format`}
                            alt={"图片找不到"} // 使用数据行中的 altText 属性作为 alt 文本
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={"上传格式要求示例"}
                            subtitle={"文件名不能含有中文"}
                            actionIcon={
                                <IconButton
                                    sx={{color: "rgba(255, 255, 255, 0.54)"}}
                                    aria-label={`上传格式要求`}
                                >
                                    <InfoIcon/>
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                    <Uploadfile2parent
                        onFileUpload={handleAppUserFileUpload}
                        fileName={"批量导入用户终端"}
                    />
                </Stack>
            </Stack>
            <DialogActions>
                {/*<IconButton aria-label="delete" size="large" onClick={() => handleReturn()}>*/}
                {/*    <KeyboardReturnIcon color={"primary"}/>*/}
                {/*</IconButton>*/}
                <Button variant="contained" size="small" onClick={() => handleReturn()}>
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

            {/*<img*/}
            {/*    style={{*/}
            {/*        width: "50%", // 设置图片宽度为容器宽度的一半*/}
            {/*        height: "auto", // 自动计算图片高度，保持原始宽高比*/}
            {/*        borderRadius: "10%", // 设置图片圆角为50%以呈现圆形*/}
            {/*    }}*/}
            {/*    // srcSet={ImgBaseUrl + `${row.bannerImg}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
            {/*    src={`http://upd.rja3.xyz/images/Apps/6037D13C-F3E9-4c1a-A08B-4535661AED9D.png?w=164&h=164&fit=crop&auto=format`}*/}
            {/*    alt={"图片找不到"} // 使用数据行中的 altText 属性作为 alt 文本*/}
            {/*    // onError={(e) => {*/}
            {/*    //     const img = e.currentTarget*/}
            {/*    //     img.src = "/photo/apkBannerimg_notfound.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x"*/}
            {/*    // }}*/}
            {/*    loading="lazy"*/}
            {/*/>*/}
        </FormContainer>
    );
};
