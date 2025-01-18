import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Button, Divider, Stack} from "@mui/material";
import {FormContainer, SelectElement, TextFieldElement} from "react-hook-form-mui";
import {LabelResp, Link} from "../../../../../api/ks/v1/km_pb";
import {LinkCalssStoreProxy} from "../../store/link/store";

const Link_Filter = () => {
    // 使用 useForm 声明一个 formContext
    const formContext = useForm<Link>({
        // defaultValues: {name: ""},
    });
    const [dataSource, setDataSource] = useState<LabelResp[]>([])
    const handleSubFormSubmit = (data: Link) => {
        // 调用父组件传递的回调函数，并将表单数据作为参数传递
        LinkCalssStoreProxy.LinkCalssFilter = data;
        // apkProxy.isRowChange = true
    };
    const handleResetForm = () => {
        formContext.reset(); // 重置表单值
        LinkCalssStoreProxy.LinkCalssFilter = {} as Link;
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
                <TextFieldElement name="name" label="apk名称"/>
                <SelectElement
                    label="二级分类列表"
                    value={"id"}
                    name="subClassId"
                    options={dataSource}
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

export default Link_Filter;
