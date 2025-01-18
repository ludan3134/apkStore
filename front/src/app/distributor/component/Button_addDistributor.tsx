import React, {useState} from "react";
import {Button, Input, message, Modal, Tag} from "antd";
import {BugOutlined, UserOutlined} from "@ant-design/icons";
import {Distributor} from "../../../api/ax/v1/axm_pb";
import {authProxy} from "../../auth/store/store";
import {IsConfirmDialog} from "../../../const/alert/store";
import {grpcDistributorInsert} from "../api/grpcDistributorInsert";
import Distributorinput from "../../../const/distributortomodel/component/distributorinput";
import {Stack} from "@mui/material";

export default function Button_addDistributor() {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [DistributorName, setDistributorName] = useState<string>();
    const [Distributorvalue, setDistributorvalue] = useState<String>();

    const showModal = () => {
        setDistributorvalue(null);
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        if (!DistributorName) {
            setOpen(false);
            setConfirmLoading(false);
            return;
        }
        var distributor = new Distributor({
            parentId: Distributorvalue || "",
            title: DistributorName,
        });
        var res = await grpcDistributorInsert(distributor, authProxy.token);
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
            <Button type="primary" onClick={showModal}>
                添加分销商
            </Button>
            <Modal
                title="添加分销商"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Stack spacing={2}>
                    <Input
                        size="large"
                        placeholder="分销商姓名"
                        prefix={<UserOutlined/>}
                        onChange={(e) => setDistributorName(e.target.value)}
                    />
                    <Distributorinput
                        setDistributorvalue={setDistributorvalue}
                        Distributorvalue={Distributorvalue}
                    />
                    <Tag icon={<BugOutlined/>} color="#cd201f">
                        如果为空,则默认为一级分销商
                    </Tag>
                </Stack>
            </Modal>
        </>
    );
}
