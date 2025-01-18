import React from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";
import {initialPlaybackParams, PlaybackStoreProxy} from "../store/store";
import {Playback} from "../../../../api/ks/v1/km_pb";

const Playback_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Playback>({
        defaultValues: initialPlaybackParams,
    });

    const handleSubFormSubmit = (data: Playback) => {
        console.log("data", data);
        PlaybackStoreProxy.PlaybackFilter = data;
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        PlaybackStoreProxy.PlaybackFilter = {} as Playback;
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
                <TextFieldElement name="channelName" label="频道名称"/>
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default Playback_Filter;
