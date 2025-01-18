import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import {initialTVApkfilterParams, TVApkStarOptions, TVApkStoreProxy,} from "../../store/apk/store";
import {ApkFilter} from "../../../../../api/fs/v1/fm_pb";
import {IsStringOption} from "../../../../../const/option";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";

const TVApk_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<ApkFilter>({
        defaultValues: initialTVApkfilterParams,
    });
    // distributor
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    const handleSubFormSubmit = (data: ApkFilter) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        TVApkStoreProxy.TVApkFilter = data;
        // TVApkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        setModelvalue(null);
        TVApkStoreProxy.TVApkFilter = {} as ApkFilter;
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
                <TextFieldElement name="name" label="TVApk名称"/>
                <TextFieldElement name="type" label="TVApk类型"/>
                <TextFieldElement name="class" label="TVApk包名"/>
                <SelectElement
                    label="星星"
                    name="star"
                    options={TVApkStarOptions}
                    sx={{
                        minWidth: "80px",
                    }}
                />

                <SelectElement
                    label="是否推送市场"
                    name="isShowOnMarket"
                    options={IsStringOption}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                <SelectElement
                    label="是否显示滚动横幅"
                    name="isShowBanner"
                    options={IsStringOption}
                    sx={{
                        minWidth: "180px",
                    }}
                />
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

export default TVApk_Filter;
