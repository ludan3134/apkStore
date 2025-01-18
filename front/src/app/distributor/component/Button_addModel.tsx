import React, {useState} from "react";
import {Button, message, Modal, TreeSelect} from "antd";
import {Distributor} from "../../../api/ax/v1/axm_pb";
import {authProxy} from "../../auth/store/store";
import {IsConfirmDialog} from "../../../const/alert/store";
import {grpcDistributortreeModelEdit} from "../api/grpcDistributortreeModelEdit";
import {useproxy_AllModel} from "../../model/store/store";
import {grpcAllModel} from "../api/grpcAllModel";

export default function Button_addModel(rows) {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [value, setValue] = useState<string[]>();
    var treeData = useproxy_AllModel();

    const onChange = (newValue: string) => {
        setValue(newValue);
    };
    const findLeafNodes = (nodes) => {
        let leaves = [];
        const traverse = (node) => {
            if (!node.children || node.children.length === 0) {
                // 如果没有子节点，将当前节点的值添加到结果中
                leaves.push(node.value);
            } else {
                // 遍历子节点
                node.children.forEach((child) => traverse(child));
            }
        };

        nodes.forEach((node) => traverse(node)); // 对每个顶级节点执行遍历
        return leaves;
    };
    const showModal = async () => {
        var res = await grpcAllModel(rows.rows.value, authProxy.token);
        const processedTreeData = findLeafNodes(res.tree);
        console.log("processedTreeData", processedTreeData);
        setValue(processedTreeData);
        setOpen(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        var distributor = new Distributor({
            // parentId:parentId,
            // title:DistributorName
        });
        var res = await grpcDistributortreeModelEdit(
            rows.rows.value,
            value,
            authProxy.token,
        );
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
                分配型号
            </Button>
            <Modal
                title="分配型号"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <TreeSelect
                    showSearch
                    style={{width: "75%"}}
                    value={value}
                    dropdownStyle={{maxHeight: 400, overflow: "auto"}}
                    placeholder="Please select"
                    allowClear
                    treeCheckable={true}
                    showCheckedStrategy={TreeSelect.SHOW_PARENT}
                    treeDefaultExpandAll
                    onChange={onChange}
                    treeData={treeData}
                />
            </Modal>
        </>
    );
}
