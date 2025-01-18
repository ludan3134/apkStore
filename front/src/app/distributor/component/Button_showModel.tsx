import React, {useState} from "react";
import {Button, Modal, Tree} from "antd";
import {authProxy} from "../../auth/store/store";
import {DownOutlined} from "@ant-design/icons";
import {grpcAllModel} from "../api/grpcAllModel";

export default function Button_showModel(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState();
    const fetchData = async () => {
        var res = await grpcAllModel(rows.rows.value, authProxy.token);
        setTreeData(res.tree);
        console.log("res", res);
    };

    const showModal = () => {
        fetchData();
        setOpen(true);
    };

    const handleOk = async () => {
        setOpen(false);
    };
    const handleCancel = () => {
        console.log("Clicked cancel button");
        setOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                查看分销商下属型号
            </Button>
            <Modal
                title="查看分销商下属型号"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Tree
                    showLine
                    switcherIcon={<DownOutlined/>}
                    treeData={treeData}
                    defaultExpandAll={true}
                />
            </Modal>
        </>
    );
}
