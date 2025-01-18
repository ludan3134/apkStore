// import React, {useState} from 'react';
// import {useForm} from 'react-hook-form';
// import {Button, IconButton, Stack} from '@mui/material';
// import {FormContainer, SelectElement, TextFieldElement} from 'react-hook-form-mui';
// import {useNavigate} from "react-router-dom";
// import DialogActions from "@mui/material/DialogActions";
// import {message} from "antd";
// import {initialVodRepeatedParams, useproxy_VodRepeatedUrl} from "../store/store";
// import {authProxy} from "../../../auth/store/store";
// import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
// import LocationBar from "../../../../const/locationbar";
// import {grpcVodRepeatedInsert} from "../api/grpcVodRepeatedInsert";
// import {VodRepeated} from "../../../../api/ta/v1/tam_pb";
// import {IsDistributorOption} from "../../../../const/option";
// import {useproxy_AllCategory, useproxy_AllOption} from "../../recommend/store/store";
// import SyncIcon from '@mui/icons-material/Sync';
// import {grpcVodRepeatedParse} from "../api/grpcVodRepeatedParse";
//
// export const VodRepeated_Add = () => {
//
//     var alloption = useproxy_AllOption();
//     var allCategory = useproxy_AllCategory();
//     // 获取xstreamtable地址信息
//     var xstreamtableUrl = useproxy_VodRepeatedUrl();
//     // 请求是否成功
//     const [loading, setLoading] = useState(false);
//     // 声明路由跳转
//     // 跳转路由
//     const navigate = useNavigate();
//     const goto = (url: string) => {
//         navigate(url, {replace: true});
//     };
//
//     // 使用 useForm 声明一个 formContext
//     const formContext = useForm<VodRepeated>({
//         // 初始化表单数据
//         defaultValues: initialVodRepeatedParams
//     });
//     var watchValue = formContext.watch(["VodRepeatedId", "hl"])
//     const handlsyncVodRepeated = async () => {
//         setLoading(true)
//         console.log("watchValue", watchValue)
//         var res = await grpcVodRepeatedParse(watchValue[1], watchValue[0], authProxy.token);
//         if (res.status && res.VodRepeated) {
//             formContext.setValue("title", res.VodRepeated.title)
//             formContext.setValue("description", res.VodRepeated.description)
//             formContext.setValue("duration", res.VodRepeated.duration)
//             formContext.setValue("viewCount", res.VodRepeated.viewCount)
//             formContext.setValue("img", res.VodRepeated.img)
//             formContext.setValue("url", res.VodRepeated.url)
//             formContext.setValue("sort", res.VodRepeated.sort)
//             formContext.setValue("regionCode", res.VodRepeated.regionCode)
//             formContext.setValue("defaultLanguage", res.VodRepeated.defaultLanguage)
//             formContext.setValue("publishedAt", res.VodRepeated.publishedAt)
//             formContext.setValue("source", res.VodRepeated.source)
//             formContext.setValue("hl", res.VodRepeated.hl
//             )
//
//         } else {
//             message.error("解析数据为空")
//         }
//         setLoading(false)
//         return true; // 添加返回 true 停止循环
//
//     };
//     // 提交表单
//     const onSubmit = async (data: VodRepeated) => {
//         setLoading(true);
//         // 如果其中一个文件存在，则执行更新操作
//         try {
//             // 执行数据更新操作
//             var response = await grpcVodRepeatedInsert(data, authProxy.token);
//             if (response.status) {
//                 message.success("添加成功")
//                 goto(xstreamtableUrl);
//             }
//         } catch (error) {
//             message.error("调用接口失败")
//             setLoading(false);
//             return;
//         }
//         setLoading(false);
//
//     };
//     // 重置表单值
//     const handleResetForm = () => {
//         formContext.reset();
//     };
//
//     // 返回上一级
//     const handleReturn = () => {
//         goto(xstreamtableUrl);
//     };
//
//     return (
//         // 使用 FormContainer 包裹表单组件
//         <FormContainer
//             formContext={formContext}
//             // 表单提交成功时的回调函数
//             onSuccess={(data) => {
//                 onSubmit(data);
//             }}
//         >
//             {loading && (<CircularIndeterminate/>)}
//
//             {/* 使用 TextFieldElement 渲染表单组件 */}
//
//             <Stack spacing={2}>
//                 <LocationBar location={"新增XCVodRepeated"}/>
//
//                 <Stack direction={"row"}>
//                     <TextFieldElement name="VodRepeatedId" label="YoutubeID"/>
//                     <IconButton aria-label="delete" size="large"
//                                 onClick={() => handlsyncVodRepeated()}>
//                         解析<SyncIcon color="primary"/>
//                     </IconButton>
//                 </Stack>
//
//                 <TextFieldElement name="hl" label="语言"/>
//                 <TextFieldElement name="title" label="标题"/>
//                 <TextFieldElement name="description" label="简介"/>
//                 <TextFieldElement name="publishedAt" label="发布年份"/>
//                 <TextFieldElement name="duration" label="时长"/>
//                 <TextFieldElement name="viewCount" label="浏览量"/>
//                 <TextFieldElement name="img" label="图片"/>
//                 <TextFieldElement name="source" label="来源"/>
//                 <TextFieldElement name="url" label="youtube地址"/>
//                 <TextFieldElement name="sort" label="排序"/>
//                 <TextFieldElement name="regionCode" label="地区"/>
//                 <TextFieldElement name="defaultLanguage" label="默认语言"/>
//                 <SelectElement
//                     label="是否推荐"
//                     name="isRecommended"
//                     options={IsDistributorOption}
//                     sx={{
//                         minWidth: '180px'
//                     }}
//                     required={true}
//                 />
//                 <SelectElement
//                     label="选项"
//                     name="classId"
//                     options={alloption}
//                     sx={{
//                         minWidth: '180px'
//                     }}
//                     required={true}
//                 />
//                 <SelectElement
//                     label="菜单"
//                     name="categoryId"
//                     options={allCategory}
//                     sx={{
//                         minWidth: '180px'
//                     }}
//                     required={true}
//                 />
//             </Stack>
//             <DialogActions>
//                 <Button variant="contained" size="large" type={"submit"} color={"success"}>
//                     提交
//                 </Button>
//                 <Button variant="contained" size="large" type="button" onClick={() => handleResetForm()}
//                         color={"error"}>
//                     重置
//                 </Button>
//             </DialogActions>
//         </FormContainer>
//     );
// };
