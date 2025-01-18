// import React, {useState} from 'react';
// import {useForm} from 'react-hook-form';
// import {Button, Stack} from '@mui/material';
// import {FormContainer, SelectElement, TextFieldElement} from 'react-hook-form-mui';
// import {useNavigate} from "react-router-dom";
// import DialogActions from "@mui/material/DialogActions";
// import {message} from "antd";
// import {useproxy_VodRepeatedEdit, useproxy_VodRepeatedUrl} from "../store/store";
// import {authProxy} from "../../../auth/store/store";
// import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
// import LocationBar from "../../../../const/locationbar";
// import {grpcVodRepeatedEdit} from "../api/grpcVodRepeatedEdit";
// import {VodRepeated} from "../../../../api/ta/v1/tam_pb";
// import {IsDistributorOption} from "../../../../const/option";
// import {useproxy_AllCategory, useproxy_AllOption} from "../../recommend/store/store";
//
//
// export const VodRepeated_Edit = () => {
//     var alloption = useproxy_AllOption();
//     var allCategory = useproxy_AllCategory();
//     // 获取编辑变量
//     var VodRepeatedEdit = useproxy_VodRepeatedEdit();
//
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
//         defaultValues: {
//             id: VodRepeatedEdit.id,
//             title: VodRepeatedEdit.title,
//             description: VodRepeatedEdit.description,
//             publishedAt: VodRepeatedEdit.publishedAt,
//             duration: VodRepeatedEdit.duration,
//             viewCount: VodRepeatedEdit.viewCount,
//             img: VodRepeatedEdit.img,
//             source: VodRepeatedEdit.source,
//             VodRepeatedId: VodRepeatedEdit.VodRepeatedId,
//             url: VodRepeatedEdit.url,
//             categoryId: VodRepeatedEdit.categoryId,
//             sort: VodRepeatedEdit.sort,
//             isRecommended: VodRepeatedEdit.isRecommended,
//             classId: VodRepeatedEdit.classId,
//             regionCode: VodRepeatedEdit.regionCode,
//             hl: VodRepeatedEdit.hl,
//             defaultLanguage: VodRepeatedEdit.defaultLanguage,
//             defaultAudioLanguage: VodRepeatedEdit.defaultAudioLanguage,
//             categoryName: VodRepeatedEdit.categoryName,
//             className: VodRepeatedEdit.className,
//         }
//     });
//
//     // 提交表单
//     const onSubmit = async (data: VodRepeated) => {
//         console.log("data", data)
//         setLoading(true);
//         // 如果其中一个文件存在，则执行更新操作
//         try {
//             // 执行数据更新操作
//             var response = await grpcVodRepeatedEdit(data, authProxy.token);
//             if (response.status) {
//                 message.success("编辑成功")
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
//                 <LocationBar location={"编辑XCVodRepeated"}/>
//                 <TextFieldElement name="title" label="标题"/>
//                 <TextFieldElement name="description" label="简介"/>
//                 <TextFieldElement name="publishedAt" label="发布年份"/>
//                 <TextFieldElement name="duration" label="时长"/>
//                 <TextFieldElement name="viewCount" label="浏览量"/>
//                 <TextFieldElement name="img" label="图片"/>
//                 <TextFieldElement name="VodRepeatedId" label="YoutubeID"/>
//                 <TextFieldElement name="source" label="来源"/>
//                 <TextFieldElement name="url" label="youtube地址"/>
//                 <TextFieldElement name="sort" label="排序"/>
//                 <TextFieldElement name="regionCode" label="地区"/>
//                 <TextFieldElement name="hl" label="语言"/>
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
