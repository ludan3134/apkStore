import * as React from "react";
import {useState} from "react";
import {Chip, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {TreeView} from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {TreeItem} from "@mui/x-tree-view/TreeItem";
import {authProxy, useauthPermissionProxy} from "../../../auth/store/store";
import DeleteIcon from "@mui/icons-material/Delete";
import {useNavigate, useParams} from "react-router-dom";
import {convertBackendDataToTree} from "../../const/convertBackendDataToTree";
import {ConvertedData} from "../../const/treedata";
import {PermissionStoreProxy} from "../store/store";
import {IsConfirmDialog, useproxy_IsConfirmDialogRefleshPage,} from "../../../../const/alert/store";
import {ActionStore} from "../../../../const/alert/model";
import ConfirmDialog from "../../../../const/alert/confirmDialog";
import {grpcPermissionList} from "../api/grpcPermissionList";
import LocationBar from "../../../../const/locationbar";
import {message} from "antd";
import {useTranslation} from "react-i18next";

export default function Permission_Tree() {
    // 刷新页面
    var refleshPage = useproxy_IsConfirmDialogRefleshPage();
    // 翻译
    const {t} = useTranslation();
    const {menuId} = useParams();
    var authmenu = useauthPermissionProxy();
    const childrenMenu = authmenu.filter(
        (option) => option.parentId === Number(menuId),
    );
    const [treeData, setTreeData] = React.useState([]);
    // 删除apk
    const [DeleteRow, setDeleteRow] = useState<Number>();
    const [Action, setAction] = useState<ActionStore>();
    // // 跳转路由
    const navigate = useNavigate();
    const goto = (url: string) => {
        navigate(url, {replace: true});
    };

    // const handleCheckboxChange = (node: ConvertedData) => {
    //     const updatedData = updateTreeData(treeData, node.id, !node.checked);
    //     setTreeData(updatedData);
    // };
    const handleDelete = async (node: ConvertedData) => {
        let foundOption = childrenMenu.find((option) => option.name === "删除权限");
        if (foundOption) {
            IsConfirmDialog.IsOpen = true;
            IsConfirmDialog.title = "确认删除选中权限";
            IsConfirmDialog.content = "该操作无法撤销,请谨慎操作!";
            setDeleteRow(node.id);
            setAction(ActionStore.DeletePermission);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    // 编辑权限
    const handledit = async (row) => {
        let foundOption = childrenMenu.find((option) => option.name === "编辑权限");
        if (foundOption) {
            PermissionStoreProxy.permissionEidt = row;
            goto(`${foundOption.url}/${foundOption.id}`);
            return true; // 添加返回 true 停止循环
        } else {
            message.error("暂无权限");
        }
    };
    React.useEffect(() => {
        const fetchData = async () => {
            // await grpcDistributorToModel();
            var response = await grpcPermissionList(0n, 4096, authProxy.token);
            const convertedData = convertBackendDataToTree(response.menuList);
            modifyName(convertedData);
            setTreeData(convertedData);
        };
        fetchData(); // 调用异步函数

        IsConfirmDialog.refleshPage = false;
    }, [refleshPage]);
    const modifyName = (data) => {
        data.map((item) => {
            item.name = t(item.name); // 假设t('some key')是您想要设置的名称
            return item;
        });
    };
    const handleMenuClick = (node: ConvertedData) => {
        console.log("node", node);
        // 处理菜单点击事件，例如进行页面跳转
        console.log("Navigate to:", node.path);
    };
    // const updateTreeData = (
    //     data: ConvertedData[],
    //     nodeId: number,
    //     checked: boolean
    // ): ConvertedData[] => {
    //     return data.map((node) => {
    //         if (node.id === nodeId) {
    //             // 更新当前节点的选中状态
    //             node.checked = checked;
    //             // 判断子节点是否是数组
    //             if (Array.isArray(node.children)) {
    //                 // 遍历循环子节点并更新数据
    //                 node.children.map((item) => updateTreeData(node.children, item.id, checked))
    //             }
    //         } else if (Array.isArray(node.children)) {
    //             // 如果当前节点不是目标节点且有子节点，则递归处理子节点
    //             node.children = updateTreeData(node.children, nodeId, checked);
    //
    //             // 更新父节点的选中状态
    //             const anyChildChecked = node.children.some((child) => child.checked);
    //             node.checked = anyChildChecked;
    //         }
    //         return node;
    //     });
    // };
    // const updateTreeData = (data: ConvertedData[], nodeId: number, checked: boolean): ConvertedData[] => {
    //     return data.map((node) => {
    //         if (node.id === nodeId) {
    //             node.checked = checked;
    //             if (Array.isArray(node.children)) {
    //                 node.children = updateTreeData(node.children, nodeId, checked);
    //             }
    //         } else if (Array.isArray(node.children)) {
    //             node.children = updateTreeData(node.children, nodeId, checked);
    //             node.checked = node.children.some((child) => child.checked);
    //         }
    //         return node;
    //     });
    // };

    const renderTree = (nodes: ConvertedData) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id.toString()}
            label={
                <Stack direction={"row"} spacing={1} margin={1}>
                    {/*<FormControlLabel*/}
                    {/*    control={*/}
                    {/*        <Checkbox*/}
                    {/*            checked={nodes.checked || false}*/}
                    {/*            // onChange={() => handleCheckboxChange(nodes)}*/}
                    {/*        />*/}
                    {/*    }*/}
                    {/*    label={nodes.name}*/}
                    {/*/>*/}
                    {/*<Stack spacing={2}>*/}

                    <Chip
                        label={
                            nodes.type === 1 ? "菜单" : nodes.type === 2 ? "页面组件" : ""
                        }
                        color={
                            nodes.type === 1
                                ? "primary"
                                : nodes.type === 2
                                    ? "secondary"
                                    : "default"
                        }
                    />{" "}
                    <Chip label={nodes.name} color="success"/>
                    <Chip label={"路由" + nodes.url} color="secondary"/>
                    <Chip label={"接口" + nodes.path} color="warning"/>
                    <Chip
                        label="删除权限"
                        color="error"
                        onClick={() => handleDelete(nodes)}
                        deleteIcon={<DeleteIcon/>}
                        variant="outlined"
                    />
                    <Chip
                        label="编辑权限"
                        color="primary"
                        onClick={() => handledit(nodes)}
                        deleteIcon={<DeleteIcon/>}
                        variant="outlined"
                    />
                </Stack>
            }
            data-path={nodes.path}
            onClick={() => handleMenuClick(nodes)}
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );

    return (
        <React.Fragment>
            <Box sx={{minHeight: 110, flexGrow: 1, maxWidth: 1200}}>
                <LocationBar location={"查看权限"}/>

                <ConfirmDialog action={Action} row={DeleteRow}/>
                <TreeView
                    aria-label="rich object"
                    defaultCollapseIcon={<ExpandMoreIcon/>}
                    defaultExpanded={["root"]}
                    defaultExpandIcon={<ChevronRightIcon/>}
                >
                    {treeData.map((node) => renderTree(node))}
                </TreeView>
            </Box>
        </React.Fragment>
    );
}
