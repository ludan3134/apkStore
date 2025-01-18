import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, IconButton, ImageListItem, ImageListItemBar, Stack,} from "@mui/material";
import {FormContainer, SelectElement} from "react-hook-form-mui";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {message} from "antd";
import {AccountBulkImport} from "../store/model";
import {useproxy_XCaccountUrl,} from "../store/store";
import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {DurationOption, platformTypeOption} from "../../../../const/option";
import {useproxy_allXCombo} from "../../live/xc_combination/store/store";
import Uploadfile2parent from "../../../../const/uploadfile/uploadfile2parent";
import {authProxy} from "../../../auth/store/store";
import {InfoIcon} from "../../../wstore/appUser/component/AppUser_BulkInsert";
import envUrls from "../../../../const/baseurl";
import {LabelResp} from "../../../../api/ks/v1/km_pb";
import {grpcAppName} from "../api/grpcAppName";

export const Xcaccount_BulkInsert = () => {
    // 获取xstreamtable地址信息
    var xstreamtableUrl = useproxy_XCaccountUrl();
    var allXCombo = useproxy_allXCombo();

    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 声明路由跳转
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };
    // 文件传递
    const [accountFile, setAccountFile] = useState<File>();
    // 请求是否成功
    const handlexcaccountFileUpload = (file: File) => {
        setAccountFile(file);
    };
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AccountBulkImport>({
        // 初始化表单数据
        defaultValues: {},
    });
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    React.useEffect(() => {
        formContext.reset()
        const fetchData = async () => {
            var res = await grpcAppName();
            setDataSource(res.appInfoList)
        };
        fetchData(); // 调用异步函数
    }, []);
    // 返回上一级
    const handleReturn = () => {
        goto(xstreamtableUrl);
    };
    // 提交表单
    const onSubmit = async (data: AccountBulkImport, file: File) => {
        console.log("data", data);
        if (!accountFile) {
            message.error("请上传批量导入文件");
            return;
        }
        setLoading(true);
        // 如果其中一个文件存在，则执行新增操作
        try {
            const formData = new FormData();
            formData.append("excel", file);
            formData.append("token", authProxy.token);
            formData.append("duration", data.duration);
            formData.append("combo_id", data.combo_id);
            formData.append("app_id", data.app_id);

            formData.append("platform_type", data.platform_type);
            const response = await fetch(envUrls.ImportXCAccountBaseUrl, {
                method: "POST",
                body: formData,
                mode: "cors",
            });
            const result = await response.json();
            console.log("result", result);

            if (result.status) {
                message.success("添加成功");
            } else {
                message.error(result.message);
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
    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                onSubmit(data, accountFile);
            }}
        >
            {loading && <CircularIndeterminate/>}

            {/* 使用 TextFieldElement 渲染表单组件 */}

            <Stack spacing={2}>
                <LocationBar location={"批量创建XC用户"}/>
                <Stack direction={"row"} spacing={2}>
                    <SelectElement
                        label="过期时间"
                        name="duration"
                        options={DurationOption}
                        sx={{
                            minWidth: "180px",
                        }}
                        required
                    />
                    <SelectElement
                        label="套餐"
                        name="combo_id"
                        options={allXCombo}
                        sx={{
                            minWidth: "180px",
                        }}
                        required
                    />
                    <SelectElement
                        label="平台类型"
                        name="platform_type"
                        options={platformTypeOption}
                        sx={{
                            minWidth: "180px",
                        }}
                        required
                    />
                    <SelectElement
                        label="appName"
                        required={true}
                        name="app_id"
                        options={dataSource}
                        sx={{
                            minWidth: "180px",
                        }}
                    />
                    <Stack style={{width: "558px", height: "296px"}}>
                        <ImageListItem>
                            <img
                                // srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`http://upd.rja3.xyz/images/Apps/20240913141447.png`}
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
                            onFileUpload={handlexcaccountFileUpload}
                            fileName={"批量创建XC用户"}
                        />
                    </Stack>
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
        </FormContainer>
    );
};
