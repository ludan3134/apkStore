import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer} from "react-hook-form-mui";
import {AdvertisementPicture} from "../../../../api/fs/v1/fm_pb";
import Distributorinput from "../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../const/distributortomodel/component/modelinput";
import {DesktopImageStoreProxy} from "../store/store";

export const DeskImage_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<AdvertisementPicture>({
        defaultValues: {},
    });
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值
    const handleSubFormSubmit = (data: AdvertisementPicture) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        // apkProxy.filterModel = data;
        console.log("data", data);

        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        if (!Modelvalue) {
            data.modelId = "";
        }
        DesktopImageStoreProxy.DesktopImageFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        DesktopImageStoreProxy.DesktopImageFilter = {} as AdvertisementPicture;
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
