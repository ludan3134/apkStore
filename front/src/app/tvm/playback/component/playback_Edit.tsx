// import React, {useState} from 'react';
// import {useForm} from 'react-hook-form';
// import {Button, Stack} from '@mui/material';
// import {DateTimePickerElement, FormContainer, TextFieldElement} from 'react-hook-form-mui';
// import {useNavigate} from "react-router-dom";
// import DialogActions from "@mui/material/DialogActions";
// import {useproxy_EventEdit, useproxy_EventUrl,} from "../store/store";
// import {Playback} from "../../../../api/ks/v1/km_pb";
// import {IsOpenDialog} from "../../../../const/alert/store";
// import {authProxy} from "../../../auth/store/store";
// import LocationBar from "../../../../const/locationbar";
// import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
// import {grpcPlaybackEdit} from "../api/grpcPlaybackEdit";
// import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
// import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
// import {EventEdit} from "../store/model";
// import {message} from "antd";
//
// export const Playback_Edit = () => {
//
//     // 获取编辑变量
//     var event = useproxy_EventEdit();
//     // 获取terminaltable地址信息
//     var eventUrl = useproxy_EventUrl();
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
//     const formContext = useForm<EventEdit>({
//         // 初始化表单数据
//         defaultValues: {
//             id: event.id,
//             title: event.title,
//             liveMatch: event.liveMatch,
//             matchData: event.matchData,
//             timezone: event.timezone,
//             ateam: event.teams?.a?.name,
//             ateamIcon: event.teams?.a?.icon,
//             bteam: event.teams?.b?.name,
//             bteamIcon: event.teams?.b?.icon
//         }
//     });
//
//
//     // 提交表单
//     const onSubmit = async (data: EventEdit) => {
//         console.log("data", data)
//         setLoading(true);
//         var Playback = new Playback({
//             id: data.id,
//             title: data.title,
//             liveMatch: data.liveMatch,
//             timezone: data.timezone,
//             matchData: data.matchData,
//             baseTime: data.baseTime.unix()
//         });
//         // 如果其中一个文件存在，则执行更新操作
//         try {
//             // 执行数据更新操作
//             var response = await grpcPlaybackEdit(Playback, authProxy.token);
//             if (response.status) {
//                 IsOpenDialog.IsOpen = true
//                 IsOpenDialog.title = "SUCCESS"
//                 IsOpenDialog.content = "更新成功"
//                 goto(eventUrl);
//             }
//         } catch (error) {
//             message.error("调用接口发生错误")
//
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
//         goto(eventUrl);
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
//                 <LocationBar location={"编辑体育赛事预告"}/>
//                 <TextFieldElement name="ateam" label="队伍A" required/>
//                 <TextFieldElement name="ateamIcon" label="队伍Alogo" required/>
//
//                 <TextFieldElement name="bteam" label="队伍B" required/>
//                 <TextFieldElement name="bteamIcon" label="队伍Blogo" required/>
//
//                 <TextFieldElement name="timezone" label="时区" type={'number'} required/>
//                 <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
//
//                     <DateTimePickerElement
//                         label="比赛时间"
//                         name="baseTime"
//                         required
//                     />
//                 </LocalizationProvider>
//             </Stack>
//             <DialogActions>
//                 {/*<Button variant="contained" size="large" onClick={() => handleReturn()}>*/}
//                 {/*    返回上一级*/}
//                 {/*</Button>*/}
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
