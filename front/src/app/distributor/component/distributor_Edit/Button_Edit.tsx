import React, {useState} from "react";
import {Button, Input, message, Modal, Space, Tag} from "antd";
import {BugOutlined, EditOutlined, UserOutlined} from "@ant-design/icons";
import {Distributor} from "../../../../api/ax/v1/axm_pb";
import {grpcDistributortreeEdit} from "../../api/grpcDistributortreeEdit";
import {authProxy} from "../../../auth/store/store";
import {IsConfirmDialog} from "../../../../const/alert/store";

export default function Button_Edit(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    console.log("rows", rows);
    const [DistributorName, setDistributorName] = useState<string>();
    console.log("rows.name", rows.rows.title);
    const [parentId, setParentId] = useState<string>();

    const showModal = () => {
        setDistributorName(rows.rows.title);
        setOpen(true);
    };

    const handleOk = async () => {
        console.log("parentId", parentId);
        console.log("DistributorName", DistributorName);
        console.log("id", rows.rows.value);
        setConfirmLoading(true);
        var distributor = new Distributor({
            id: rows.rows.value,
            parentId: parentId,
            title: DistributorName,
        });
        var res = await grpcDistributortreeEdit(distributor, authProxy.token);
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
                title="编辑分销商"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Space direction={"vertical"} size={"middle"}>
                    <Input
                        size="large"
                        placeholder="分销商姓名"
                        prefix={<UserOutlined/>}
                        value={DistributorName}
                        onChange={(e) => setDistributorName(e.target.value)}
                    />
                    {/*<Distributor_Alldistributor setParentValue={setParentId}/>*/}
                    <Tag icon={<BugOutlined/>} color="#cd201f">
                        如果为空,则默认为一级分销商
                    </Tag>
                </Space>
            </Modal>
        </>
    );
}
