import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Checkbox, FormControlLabel} from "@mui/material";
import Box from "@mui/material/Box";
import {TreeView} from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import IconButton from "@mui/material/IconButton";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import DialogActions from "@mui/material/DialogActions";
import {grpcRoleMenuEdit} from "../api/grpcRoleMenuEdit";
import {authProxy} from "../../../auth/store/store";
import {convertBackendDataToTree} from "../../const/convertBackendDataToTree";
import {ConvertedData} from "../../const/treedata";
import {usePermissions} from "../../permission/store/store";

export default function Assignpermission_Button({rows}) {
    var menus = usePermissions();
    const [open, setOpen] = React.useState(false);
    const convertedData = convertBackendDataToTree(menus);
    console.log("convertedData", convertedData);
    const [treeData, setTreeData] = React.useState(convertedData);
    console.log("treeData", treeData);
    const handleCheckboxChange = (node: ConvertedData) => {
        const updatedData = updateTreeData(treeData, node.id, !node.checked);
        setTreeData(updatedData);
    };

    const updateTreeData = (
        data: ConvertedData[],
        nodeId: number,
        checked: boolean,
    ): ConvertedData[] => {
        return data.map((node) => {
            if (node.id === nodeId) {
                // 更新当前节点的选中状态
                node.checked = checked;
                if (Array.isArray(node.children)) {
                    // 遍历循环子节点并更新数据
                    node.children.map((item) =>
                        updateTreeData(node.children, item.id, checked),
                    );
                }
            } else if (Array.isArray(node.children)) {
                // 如果当前节点不是目标节点且有子节点，则递归处理子节点
                node.children = updateTreeData(node.children, nodeId, checked);

                // 更新父节点的选中状态
                const anyChildChecked = node.children.some((child) => child.checked);
                node.checked = anyChildChecked;
            }
            return node;
        });
    };

    const renderTree = (nodes: ConvertedData) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={nodes.checked || false}
                            onChange={() => handleCheckboxChange(nodes)}
                        />
                    }
                    label={nodes.name}
                />
            }
            data-path={nodes.path}
            onClick={() => handleMenuClick(nodes)}
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );
    const handleMenuClick = (node: ConvertedData) => {
        console.log("node", node);
        // 处理菜单点击事件，例如进行页面跳转
        console.log("Navigate to:", node.path);
        // goto(node.path);
        // 将url赋值给testStoreproxy
        // authStoreProxy.url = node.path;
    };
    const handleUpload = () => {
        const selectedNodes: ConvertedData[] = [];

        // 遍历整个树状数据结构，找到所有选中的节点
        const traverseTree = (nodes: ConvertedData[]) => {
            nodes.forEach((node) => {
                if (node.checked) {
                    selectedNodes.push(node);
                }
                if (Array.isArray(node.children)) {
                    traverseTree(node.children);
                }
            });
        };

        traverseTree(treeData);

        // 在这里执行上传逻辑，将选中的节点数据进行上传
        console.log("Selected Nodes:", selectedNodes);
        var updateRoleMenuResponse = grpcRoleMenuEdit(
            parseInt(rows.id),
            selectedNodes,
            authProxy.token,
        );
        setOpen(false);
        // 进行上传操作...
    };

    const handleClose = () => {
        setOpen(false);
    };
    // 开启对话框
    const handleClickOpen = async () => {
        setOpen(true);
    };

    return (
        <React.Fragment>
            <IconButton aria-label="delete" size="medium" onClick={handleClickOpen}>
                <PermIdentityIcon fontSize="inherit"/>
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={"lg"}
            >
                <DialogTitle>
                    分配权限
                    {/*<Button onClick={handleResetForm}>重置</Button>*/}
                </DialogTitle>

                <DialogContent dividers={true}>
                    <Box sx={{minHeight: 110, flexGrow: 1, maxWidth: 300}}>
                        <TreeView
                            aria-label="rich object"
                            defaultCollapseIcon={<ExpandMoreIcon/>}
                            defaultExpanded={["root"]}
                            defaultExpandIcon={<ChevronRightIcon/>}
                        >
                            {treeData.map((node) => renderTree(node))}
                        </TreeView>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpload}>分配</Button>
                    <Button onClick={handleClose} autoFocus>
                        取消
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
