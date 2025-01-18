import React, {useState} from "react";
import {Button, Input, message, Modal, Space} from "antd";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import {Model} from "../../../../api/ax/v1/axm_pb";
import {grpcmodelEdit} from "../../api/grpcmodelEdit";
import {authProxy} from "../../../auth/store/store";
import {IsConfirmDialog} from "../../../../const/alert/store";

export default function Button_Edit(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    console.log("rows", rows);
    const [ModelName, setModelName] = useState<string>();
    console.log("rows.name", rows.rows.title);
    const [parentId, setParentId] = useState<string>();

    const showModal = () => {
        setModelName(rows.rows.title);
        setOpen(true);
    };

    const handleOk = async () => {
        console.log("parentId", parentId);
        console.log("id", rows.rows.value);
        setConfirmLoading(true);
        var model = new Model({
            id: rows.rows.value,
            parentId: parentId,
            name: ModelName,
        });
        var res = await grpcmodelEdit(model, authProxy.token);
        if (res.status) {
            IsConfirmDialog.refleshPage = true;
            message.success("插入成功");
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

    return (
        <>
            <Button
                shape="circle"
                icon={<EditOutlined/>}
                onClick={showModal}
            ></Button>
            <Modal
                title="编辑型号"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Space direction={"vertical"} size={"middle"}>
                    <Input
                        size="large"
                        placeholder="型号姓名"
                        prefix={<UserOutlined/>}
                        value={ModelName}
                        onChange={(e) => setModelName(e.target.value)}
                    />
                    {/*<Model_Allmodel setParentValue={setParentId}/>*/}
                    {/*<Tag icon={<BugOutlined/>} color="#cd201f">*/}
                    {/*    如果为空,则默认为一级型号*/}
                    {/*</Tag>*/}
                </Space>
            </Modal>
        </>
    );
}
