import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement,} from "react-hook-form-mui";
import Distributorinput from "../../../../../const/distributortomodel/component/distributorinput";
import Modelinput from "../../../../../const/distributortomodel/component/modelinput";
import {Apps} from "../../../../../api/ws/v1/wm_pb";
import {AppsStoreProxy, useproxy_allCategories,} from "../../store/app/store";

const App_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Apps>({
        defaultValues: AppsStoreProxy.AppsFilter,
    });
    // distributor
    // 分销商值
    const [Distributorvalue, setDistributorvalue] = useState<String>();
    const [Modelvalue, setModelvalue] = useState<String>();
    // 分销商值

    const handleSubFormSubmit = (data: Apps) => {
        // console.log("data",data.categoriesIds)
        data.distributorId = Distributorvalue || "";
        data.modelId = Modelvalue || "";
        AppsStoreProxy.AppsFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        setDistributorvalue(null);
        setModelvalue(null);
        AppsStoreProxy.AppsFilter = {} as Apps;
    };
    var allCategories = useproxy_allCategories();

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
                <TextFieldElement name="appName" label="app名称"/>

                {/*<TextFieldElement name="name" label="apk名称"/>*/}
                {/*<TextFieldElement name="type" label="apk类型"/>*/}
                <TextFieldElement name="class" label="apk包名"/>
                <SelectElement
                    label="菜单分类"
                    name="categoriesId"
                    options={allCategories}
                    sx={{
                        minWidth: "150px",
                    }}
                />
                {/*<AutocompleteElement*/}
                {/*	name="categoriesIds"*/}
                {/*	options={allCategories}*/}
                {/*/>*/}
                {/*<MultiSelectElement*/}
                {/*	itemKey="id"*/}
                {/*	itemLabel="label"*/}
                {/*	label="菜单分类"*/}
                {/*	name="categoriesIds"*/}
                {/*	options={allCategories}*/}
                {/*	multiple={false}*/}
                {/*	multiline={false}*/}
                {/*	minWidth={300}*/}
                {/*/>*/}

                {/*<SelectElement*/}
                {/*    label="是否推送市场"*/}
                {/*    name="isShowOnMarket"*/}
                {/*    options={IsStringOption}*/}
                {/*    sx={{*/}
                {/*        minWidth: '150px'*/}
                {/*    }}*/}
                {/*/>*/}
                {/*<SelectElement*/}
                {/*    label="是否显示滚动横幅"*/}
                {/*    name="isShowBanner"*/}
                {/*    options={IsStringOption}*/}
                {/*    sx={{*/}
                {/*        minWidth: '180px'*/}
                {/*    }}*/}
                {/*/>*/}
                <Distributorinput
                    setDistributorvalue={setDistributorvalue}
                    Distributorvalue={Distributorvalue}
                />
                <Modelinput
                    Distributorvalue={Distributorvalue}
                    setModelvalue={setModelvalue}
                />
                {/*<MultiSelectElement*/}
                {/*    itemKey="id"*/}
                {/*    itemLabel="label"*/}
                {/*    label="菜单分类"*/}
                {/*    name="categoriesIds"*/}
                {/*    options={allCategories}*/}
                {/*    showChips={true}*/}
                {/*    required={true}*/}
                {/*/>*/}
                <Button type="submit">筛选</Button>
                <Button type="button" onClick={handleResetForm}>
                    重置
                </Button>
            </Stack>
        </FormContainer>
    );
};

export default App_Filter;
