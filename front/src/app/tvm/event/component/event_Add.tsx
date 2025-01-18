import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {authProxy} from "../../../auth/store/store";
import {IsUploadFileReset} from "../../../../const/uploadfile/store";

import CircularIndeterminate from "../../../../const/alert/circularIndeterminate";
import LocationBar from "../../../../const/locationbar";
import {MajorEvent} from "../../../../api/ks/v1/km_pb";
import {useproxy_EventUrl} from "../store/store";
import {grpcEventInsert} from "../api/grpcEventInsert";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {EventInsert} from "../store/model";
import {DateTimePickerElement, FormContainer, TextFieldElement,} from "react-hook-form-mui";
import {message} from "antd";

export const Event_Add = () => {
    // 获取addtable地址信息
    var eventUrl = useproxy_EventUrl();
    // 请求是否成功
    const [loading, setLoading] = useState(false);
    // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // 使用 useForm 声明一个 formContext
    const formContext = useForm<EventInsert>({});

    // 表单提交时的回调函数
    const onSubmit = async (add: EventInsert) => {
        console.log("add", add);
        console.log("add.baseTime", add.baseTime);
        var majorEvent = new MajorEvent({
            title: add.title,
            liveMatch: add.liveMatch,
            matchData: add.matchData,
            baseTime: add.baseTime.unix(),
            teams: {
                a: {
                    name: add.ateam,
                    icon: add.ateamIcon,
                },
                b: {
                    name: add.bteam,
                    icon: add.bteamIcon,
                },
            },
        });
        setLoading(true);
        try {
            // 执行数据更新操作
            var response = await grpcEventInsert(majorEvent, authProxy.token);
            if (response.status) {
                message.success("添加成功");

                goto(eventUrl);
            }
        } catch (error) {
            message.error("调用接口发生错误");

            setLoading(false);
            return;
        }
        setLoading(false);
    };
    // 表单重置
    const handleResetForm = () => {
        IsUploadFileReset.IsReset = true;
        formContext.reset(); // 重置表单值
    };
    // 关于distributor to models

    /*   const selectedDistributor = formContext.watch('distributorId');
       useEffect(() => {
           formContext.resetField("modelId", {defaultValue: ""})
           Distributor2modelProxy.filterModels = Distributor2modelProxy.models.filter((model) => model.distributorId === selectedDistributor);
       }, [selectedDistributor]);

       const distributors = useDistributors();
       const models = usefiltermodel();*/
    // 关于distributor to models
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
                <LocationBar location={"新增体育赛事预告"}/>
                <TextFieldElement name="title" label="标题" required/>
                {/*<TextFieldElement name="liveMatch" label="liveMatch" required/>*/}
                {/*<TextFieldElement name="matchData" label="对阵信息" required/>*/}
                <TextFieldElement name="ateam" label="队伍A" required/>
                <TextFieldElement name="ateamIcon" label="队伍Alogo" required/>

                <TextFieldElement name="bteam" label="队伍B" required/>
                <TextFieldElement name="bteamIcon" label="队伍Blogo" required/>

                <TextFieldElement
                    name="timezone"
                    label="时区"
                    type={"number"}
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DateTimePickerElement label="比赛时间" name="baseTime" required/>
                </LocalizationProvider>
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
