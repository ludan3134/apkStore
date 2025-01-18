import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {DatePickerElement, FormContainer} from "react-hook-form-mui";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {IsOpenDialog} from "../../../../const/alert/store";
import {CommonMeta} from "../../../../api/com/v1/pagemeta_pb";
import {EventStoreProxy} from "../store/store";
import {EventTimeFilter} from "../store/model";

export const Event_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<EventTimeFilter>({});
    const handleSubFormSubmit = (data: EventTimeFilter) => {
        var startTime = data.startTime;
        var a = startTime.unix();
        var endTime = data.endTime;
        var b = endTime.unix();
        if (a > b) {

            IsOpenDialog.IsOpen = true;
            IsOpenDialog.title = "ERROR";
            IsOpenDialog.content = "结束时间不能早于开始时间";
            handleResetForm();
        } else {
            EventStoreProxy.EventFilter = new CommonMeta({
                begin: startTime.unix(),
                end: endTime.unix(),
            });
        }

        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;
        // if (validateMacAddress(data.macString)) {
        //     data.macString = addColonsToMacAddress(data.macString)
        // } else {
        //     IsOpenDialog.IsOpen = true
        //     IsOpenDialog.title = "ERROR"
        //     IsOpenDialog.content = "mac地址输入格式不正确,请重新输入"
        //     handleResetForm();
        //     return
        // }
        // TerminalStoreProxy.TerminalFilter = data
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        EventStoreProxy.EventFilter = {} as CommonMeta;
        formContext.reset(); // 重置表单值
    };

    return (
        // 使用 FormContainer 包裹表单组件
        <FormContainer
            formContext={formContext}
            // 表单提交成功时的回调函数
            onSuccess={(data) => {
                handleSubFormSubmit(data);
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                divider={<Divider orientation="vertical" flexItem/>}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DatePickerElement label="赛事开始时间" name="startTime" required/>
                    <DatePickerElement label="赛事结束时间" name="endTime" required/>
                </LocalizationProvider>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};
