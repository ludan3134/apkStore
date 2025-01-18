import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {DatePickerElement, FormContainer} from "react-hook-form-mui";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {message} from "antd";

import Distributorinput from "../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../const/distributortomodel/component/modelinput";
import {ChartFilter} from "../store/model";
import {ChartFilterStoreProxy} from "../store/store";
import dayjs from "dayjs";

export const Chart_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ChartFilter>({});
    const [Distributorvalue, setDistributorvalue] = useState<string>();
    const [Modelvalue, setModelvalue] = useState<string>();
    const handleSubFormSubmit = (data: ChartFilter) => {
        var startTime = data.startTime;
        var a = startTime.unix();
        var endTime = data.endTime;
        var b = endTime.unix();

        if (a > b) {
            message.error("结束时间不能早于开始时间")
            handleResetForm();
        } else {
            if (Distributorvalue == null || Modelvalue == null) {
                ChartFilterStoreProxy.chartFilter.distributorId = ""
                ChartFilterStoreProxy.chartFilter.modelId = ""
            }
            ChartFilterStoreProxy.chartFilter.distributorId = Distributorvalue || "";
            ChartFilterStoreProxy.chartFilter.modelId = Modelvalue || "";
            ChartFilterStoreProxy.chartFilter.startTime = data.startTime;
            ChartFilterStoreProxy.chartFilter.endTime = data.endTime;
        }
    };
    const handleResetForm = () => {
        const now = dayjs();
        // 设置 startTime 为当前日期的前15天
        ChartFilterStoreProxy.chartFilter.startTime = now.subtract(15, 'day').startOf('day');
        // 设置 endTime 为当前日期的最后一刻
        ChartFilterStoreProxy.chartFilter.endTime = now.endOf('day');
        ChartFilterStoreProxy.chartFilter.distributorId = "";
        ChartFilterStoreProxy.chartFilter.modelId = "";

        setDistributorvalue(null);
        setModelvalue(null);

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
                    <DatePickerElement label="开始时间" name="startTime" required/>
                    <DatePickerElement label="结束时间" name="endTime" required/>
                </LocalizationProvider>
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />

                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};
