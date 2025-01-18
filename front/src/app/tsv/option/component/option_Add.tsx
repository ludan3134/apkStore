// import React, {useState} from 'react';
// import {useForm} from 'react-hook-form';
// import {Button, Stack} from '@mui/material';
// import {FormContainer, SelectElement, TextFieldElement} from 'react-hook-form-mui';
// import {useNavigate} from "react-router-dom";
// import DialogActions from "@mui/material/DialogActions";
// import {message} from "antd";
// import {initialClassInfoParams, useproxy_ClassInfoUrl} from "../store/store";
// import {authProxy} from "../../../auth/store/store";
// import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
// import LocationBar from "../../../../const/locationbar";
// import {ClassInfo} from "../../../../api/ta/v1/tam_pb";
//
//
// export const Option_Add = () => {
//
//
//     // 获取xstreamtable地址信息
//     var xstreamtableUrl = useproxy_ClassInfoUrl();
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
//     const formContext = useForm<ClassInfo>({
//         // 初始化表单数据
//         defaultValues: initialClassInfoParams
//     });
//
//     // 提交表单
//     const onSubmit = async (data: ClassInfo) => {
//         console.log("data", data)
//         setLoading(true);
//         // 如果其中一个文件存在，则执行更新操作
//         try {
//             // 执行数据更新操作
//             var response = await grpcOptionInsert(data, authProxy.token);
//             if (response.status) {
//                 message.success("添加成功")
//                 // goto(xstreamtableUrl);
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
//                 <LocationBar location={"添加XCClassInfo"}/>
//                 <TextFieldElement name="url" label="地址" required/>
//                 <TextFieldElement name="maxConnections" label="最大连接数" required/>
//                 <SelectElement
//                     label="类型"
//                     name="type"
//                     options={TvmClassInfoOption}
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
