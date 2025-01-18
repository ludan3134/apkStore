import React, {useState} from "react";
import {Button, Input, message, Modal, Select, Space, Tag} from "antd";
import {BugOutlined, UserOutlined} from "@ant-design/icons";
import {Model} from "../../../api/ax/v1/axm_pb";
import {authProxy} from "../../auth/store/store";
import {IsConfirmDialog} from "../../../const/alert/store";
import {grpcModelnsert} from "../api/grpcModelnsert";
import Model_Allmodel from "./model_Edit/model_Allmodel";
import {IsTypeOption} from "../../../const/option";
import {grpcAllModel} from "../api/grpcAllModel";
import {ModelStoreProxy} from "../store/store";

export default function Button_insertModel() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ModelName, setModelName] = useState<string>();
    const [parentId, setParentId] = useState<string>();
    const [type, setType] = useState();

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        if (!ModelName || !type) {
            message.error("请检查输入值,输入值不能为空");
            setConfirmLoading(false);
            return;
        }
        var model = new Model({
            parentId: parentId,
            name: ModelName,
            type: type,
        });

        var res = await grpcModelnsert(model, authProxy.token);
        if (res.status) {
            IsConfirmDialog.refleshPage = true;
            message.success("插入成功");
            var allModelResponse = await grpcAllModel();
            ModelStoreProxy.AllModel = allModelResponse.tree;
            setOpen(false);
        } else {
            message.error("插入失败");
            setOpen(false);
        }
        // message.destroy()
        setConfirmLoading(false);
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };
    const onChange = (value: string) => {
        console.log("value", value);
        setType(value);
        console.log(`selected ${value}`);
    };

    const filterOption = (
        input: string,
        option?: { label: string; value: number },
    ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    return (
        <>
            <Button type="primary" onClick={showModal}>
                插入型号
            </Button>
            <Modal
                title="添加型号"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Space direction={"vertical"} size={"middle"}>
                    <Input
                        size="large"
                        placeholder="型号名称"
                        prefix={<UserOutlined/>}
                        onChange={(e) => setModelName(e.target.value)}
                    />
                    <Model_Allmodel setParentValue={setParentId}/>
                    <Tag icon={<BugOutlined/>} color="#cd201f">
                        如果为空,则默认为一级型号
                    </Tag>
                    <Select
                        showSearch
                        placeholder="请输入类型"
                        optionFilterProp="children"
                        onChange={onChange}
                        filterOption={filterOption}
                        options={IsTypeOption}
                    />
                </Space>
            </Modal>
        </>
    );
}
