import React, {useState} from "react";
import {Button, Modal, Tree} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {grpcAllModel} from "../api/grpcAllModel";

export default function Button_editModel(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [treeData, setTreeData] = useState();
    const fetchData = async () => {
        var res = await grpcAllModel();
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
            {/*<Button shape="circle" icon={<EyeOutlined/>} onClick={showModal}></Button>*/}
            <Button type="primary" onClick={showModal}>
                编辑型号
            </Button>
            <Modal
                title="查看型号下属型号"
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
