import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {Channel, LabelResp} from "../../../../../api/ks/v1/km_pb";
import {ThirdCalssStoreProxy} from "../../store/third/store";
import {IsBoolOption, IsStringOption} from "../../../../../const/option";
import {grpcFaildRecordList} from "../../../../log/faildrecord/api/grpcFaildRecordList";
import {authProxy} from "../../../../auth/store/store";
import {IsConfirmDialog} from "../../../../../const/alert/store";
import {grpcAllSubClass} from "../../api/third/grpcAllSubClass";

const Third_Filter = ({mainClassId}) => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Channel>({
        defaultValues: {name: ""},
    });
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    const handleSubFormSubmit = (data: Channel) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        ThirdCalssStoreProxy.ThirdCalssFilter = data;
        // apkProxy.isRowChange = true
    };
    React.useEffect(() => {
        formContext.reset()
        ThirdCalssStoreProxy.ThirdCalssFilter = {} as Channel;
        const fetchData = async () => {
            var res = await grpcAllSubClass(authProxy.token,mainClassId);
            setDataSource(res.subClassList)
        };
        fetchData(); // 调用异步函数
    }, []);
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        ThirdCalssStoreProxy.ThirdCalssFilter = {} as Channel;
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
                <TextFieldElement name="name" label="频道名称"/>
                <TextFieldElement name="channelNumber" label="频道号" type={"number"}/>

                <SelectElement
                    label="二级分类"
                    value={"id"}
                    name="subClassId"
                    options={dataSource}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    label="是否回放"
                    name="playbackFilter"
                    options={IsStringOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    label="是否推荐"
                    name="recommendFilter"
                    options={IsStringOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    label="是否加密"
                    name="adultFilter"
                    options={IsStringOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Third_Filter;
